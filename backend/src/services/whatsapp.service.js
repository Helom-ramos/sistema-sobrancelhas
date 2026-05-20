import Appointment from '../models/Appointment.js'
import Settings from '../models/Settings.js'

const BASE_URL = process.env.EVOLUTION_API_URL
const API_KEY = process.env.EVOLUTION_API_KEY
const INSTANCE = process.env.EVOLUTION_INSTANCE

function fmtDate(dt) {
  return new Date(dt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: '2-digit' })
}
function fmtTime(dt) {
  return new Date(dt).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })
}

async function send(phone, message) {
  if (!BASE_URL || !API_KEY) {
    console.log(`[WhatsApp SIMULADO] → ${phone}: ${message}`)
    return
  }
  const delay = 2000 + Math.random() * 3000 // 2-5s anti-bloqueio
  await new Promise(r => setTimeout(r, delay))
  const res = await fetch(`${BASE_URL}/message/sendText/${INSTANCE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: API_KEY },
    body: JSON.stringify({ number: phone, text: message })
  })
  if (!res.ok) throw new Error(`Evolution API erro: ${res.status}`)
}

export async function sendBookingConfirmation(appointmentId) {
  const appt = await Appointment.findById(appointmentId).populate('client service')
  const settings = await Settings.findOne()
  if (!appt) return

  const clientMsg =
    `✅ *Agendamento confirmado!*\n\n` +
    `👤 ${appt.client.name}\n` +
    `💆 ${appt.service.name}\n` +
    `📅 ${fmtDate(appt.datetime)}\n` +
    `⏰ ${fmtTime(appt.datetime)}\n` +
    `💰 R$ ${appt.service.price.toFixed(2)}\n\n` +
    `📍 ${settings.address || 'Confirmar endereço com o salão'}\n\n` +
    `Até lá! ✨`

  const ownerMsg =
    `📌 *Novo agendamento!*\n\n` +
    `👤 ${appt.client.name} (${appt.client.phone})\n` +
    `💆 ${appt.service.name}\n` +
    `📅 ${fmtDate(appt.datetime)} às ${fmtTime(appt.datetime)}\n` +
    `💰 R$ ${appt.service.price.toFixed(2)}`

  await send(appt.client.phone, clientMsg)
  if (settings.phone) await send(settings.phone, ownerMsg)
}

export async function sendPresenceCheck(appointmentId) {
  const appt = await Appointment.findById(appointmentId).populate('client service')
  if (!appt || appt.confirmation.reminderSent) return

  const msg =
    `Olá, *${appt.client.name}*! 👋\n\n` +
    `Seu horário é em *30 minutos*:\n` +
    `💆 ${appt.service.name}\n` +
    `⏰ ${fmtTime(appt.datetime)}\n\n` +
    `Você vai comparecer?\n` +
    `1️⃣ *SIM*, vou comparecer\n` +
    `2️⃣ *NÃO*, preciso cancelar`

  await send(appt.client.phone, msg)
  appt.confirmation.reminderSent = true
  await appt.save()
}

export async function notifyOwnerOfResponse(appointmentId, response) {
  const appt = await Appointment.findById(appointmentId).populate('client service')
  const settings = await Settings.findOne()
  if (!appt || !settings?.phone) return

  const emoji = response === 'yes' ? '✅' : response === 'no' ? '❌' : '⚠️'
  const text = response === 'yes'
    ? `confirmou presença`
    : response === 'no'
    ? `*CANCELOU* o agendamento`
    : `*não respondeu* a confirmação`

  const msg =
    `${emoji} *${appt.client.name}* ${text}\n` +
    `💆 ${appt.service.name} — ${fmtTime(appt.datetime)}`

  await send(settings.phone, msg)
}
