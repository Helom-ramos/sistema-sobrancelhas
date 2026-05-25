import { Router } from 'express'
import Client from '../models/Client.js'
import Appointment from '../models/Appointment.js'
import { notifyOwnerOfResponse, sendCancellationNotification } from '../services/whatsapp.service.js'

const router = Router()

router.post('/webhook', async (req, res) => {
  res.sendStatus(200) // responde imediatamente ao Evolution API

  try {
    const { data } = req.body
    if (!data || data.key?.fromMe) return // ignora mensagens enviadas por nós

    const text = (
      data.message?.conversation ||
      data.message?.extendedTextMessage?.text || ''
    ).trim().toLowerCase()

    const rawPhone = data.key?.remoteJid?.replace('@s.whatsapp.net', '') || ''
    // normaliza: remove o 55 do Brasil para bater com o banco (que salva sem DDI)
    const phone = rawPhone.startsWith('55') && rawPhone.length > 11 ? rawPhone.slice(2) : rawPhone
    if (!phone || !text) return

    const isYes = ['1', 'sim', 's', 'yes'].includes(text)
    const isNo  = ['2', 'nao', 'não', 'n', 'no'].includes(text)
    if (!isYes && !isNo) return

    // Busca cliente pelo telefone
    const client = await Client.findOne({ phone })
    if (!client) return

    // Busca o agendamento mais próximo deste cliente que aguarda resposta
    const appt = await Appointment.findOne({
      client: client._id,
      status: 'confirmed',
      datetime: { $gte: new Date() },
      'confirmation.reminderSent': true,
      'confirmation.response': null
    }).sort({ datetime: 1 })

    if (!appt) return

    appt.confirmation.response = isYes ? 'yes' : 'no'
    appt.confirmation.respondedAt = new Date()
    if (isNo) { appt.status = 'cancelled'; appt.cancelledBy = 'whatsapp' }
    await appt.save()

    await notifyOwnerOfResponse(appt._id, isYes ? 'yes' : 'no').catch(console.error)
    if (isNo) await sendCancellationNotification(appt._id).catch(console.error)
  } catch (err) {
    console.error('[Webhook]', err.message)
  }
})

export default router
