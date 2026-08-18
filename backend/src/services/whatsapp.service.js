import Appointment from '../models/Appointment.js'
import Settings from '../models/Settings.js'

const BASE_URL  = process.env.EVOLUTION_API_URL
const API_KEY   = process.env.EVOLUTION_API_KEY
const INSTANCE  = process.env.EVOLUTION_INSTANCE
const SITE_URL  = process.env.FRONTEND_URL || 'http://localhost:5173'

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('55') ? digits : `55${digits}`
}

function fmtDate(dt) {
  return new Date(dt).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit'
  })
}

function fmtTime(dt) {
  return new Date(dt).toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function send(phone, message) {
  if (!BASE_URL || !API_KEY) {
    console.log(`[WhatsApp SIMULADO] → ${phone}: ${message}`)
    return
  }
  await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000))
  const res = await fetch(`${BASE_URL}/message/sendText/${INSTANCE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: API_KEY },
    body: JSON.stringify({ number: formatPhone(phone), textMessage: { text: message } })
  })
  if (!res.ok) throw new Error(`Evolution API erro: ${res.status}`)
}

export async function sendBookingConfirmation(appointmentId) {
  const appt = await Appointment.findById(appointmentId).populate('client service')
  const settings = await Settings.findOne()
  if (!appt) return

  const cancelLink = `${SITE_URL}/cancelar/${appointmentId}`

  const clientMsg =
    `✅ *Agendamento confirmado!*\n\n` +
    `Olá, *${appt.client.name}*! 🌸\n\n` +
    `Sua visita está agendada:\n` +
    `💆 ${appt.service.name}\n` +
    `📅 ${fmtDate(appt.datetime)}\n` +
    `⏰ ${fmtTime(appt.datetime)}\n` +
    `💰 R$ ${appt.service.price.toFixed(2)}\n` +
    (settings?.address ? `📍 ${settings.address}\n` : '') +
    `\nVou te enviar um lembrete ${settings?.reminderMinutesBefore ?? 30} minutos antes. ✨\n\n` +
    `_Precisa cancelar? Acesse:_\n${cancelLink}`

  const ownerMsg =
    `📌 *Novo agendamento!*\n\n` +
    `👤 *${appt.client.name}* (${appt.client.phone})\n` +
    `💆 ${appt.service.name}\n` +
    `📅 ${fmtDate(appt.datetime)} às ${fmtTime(appt.datetime)}\n` +
    `💰 R$ ${appt.service.price.toFixed(2)}`

  await send(appt.client.phone, clientMsg)
  if (settings?.phone) await send(settings.phone, ownerMsg)
}

export async function sendPresenceCheck(appointmentId) {
  const appt = await Appointment.findById(appointmentId).populate('client service')
  if (!appt || appt.confirmation.reminderSent) return

  const settings = await Settings.findOne()

  const msg =
    `Olá, *${appt.client.name}*! 👋\n\n` +
    `Seu horário é em *${settings?.reminderMinutesBefore ?? 30} minutos*:\n` +
    `💆 ${appt.service.name}\n` +
    `⏰ ${fmtTime(appt.datetime)}\n\n` +
    `Te esperamos! 🌸`

  await send(appt.client.phone, msg)
  appt.confirmation.reminderSent = true
  await appt.save()
}

export async function sendCancellationNotification(appointmentId) {
  const appt = await Appointment.findById(appointmentId).populate('client service')
  const settings = await Settings.findOne()
  if (!appt) return

  const clientMsg =
    `❌ *Agendamento cancelado*\n\n` +
    `Seu agendamento foi cancelado com sucesso:\n` +
    `💆 ${appt.service.name}\n` +
    `📅 ${fmtDate(appt.datetime)} às ${fmtTime(appt.datetime)}\n\n` +
    `Sentimos muito! Será um prazer receber você outra hora. 🌸\n` +
    `_Para reagendar, acesse:_\n${SITE_URL}/agendar`

  const ownerMsg =
    `❌ *Cancelamento*\n\n` +
    `*${appt.client.name}* cancelou o agendamento:\n` +
    `💆 ${appt.service.name}\n` +
    `📅 ${fmtDate(appt.datetime)} às ${fmtTime(appt.datetime)}\n` +
    `📞 ${appt.client.phone}`

  await send(appt.client.phone, clientMsg)
  if (settings?.phone) await send(settings.phone, ownerMsg)
}

export async function notifyOwnerOfResponse(appointmentId, response) {
  const appt = await Appointment.findById(appointmentId).populate('client service')
  const settings = await Settings.findOne()
  if (!appt) return

  const emoji = response === 'yes' ? '✅' : '❌'
  const text  = response === 'yes'
    ? `confirmou presença`
    : `*cancelou* o agendamento`

  if (settings?.phone) {
    await send(settings.phone,
      `${emoji} *${appt.client.name}* ${text}\n` +
      `💆 ${appt.service.name} — ${fmtTime(appt.datetime)}`
    )
  }
}
