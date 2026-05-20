import { Router } from 'express'
import Appointment from '../models/Appointment.js'
import { notifyOwnerOfResponse } from '../services/whatsapp.service.js'

const router = Router()

// Webhook: Evolution API envia aqui as respostas dos clientes
router.post('/webhook', async (req, res) => {
  try {
    const { data } = req.body
    if (!data?.message?.conversation && !data?.message?.extendedTextMessage) {
      return res.sendStatus(200) // ignora outros tipos de mensagem
    }

    const text = (data.message.conversation || data.message.extendedTextMessage?.text || '').trim().toLowerCase()
    const phone = data.key?.remoteJid?.replace('@s.whatsapp.net', '')
    if (!phone) return res.sendStatus(200)

    // Identifica se é SIM (1/sim) ou NÃO (2/nao/não)
    const isYes = ['1', 'sim', 's', 'yes'].includes(text)
    const isNo = ['2', 'nao', 'não', 'n', 'no'].includes(text)
    if (!isYes && !isNo) return res.sendStatus(200)

    // Busca agendamento pendente de resposta deste número
    const now = new Date()
    const appt = await Appointment.findOne({
      status: 'confirmed',
      datetime: { $gte: now },
      'confirmation.reminderSent': true,
      'confirmation.response': null
    }).populate('client').then(docs =>
      // Garante que o telefone bate com o cliente
      Array.isArray(docs)
        ? docs.find(a => a.client.phone === phone)
        : docs?.client?.phone === phone ? docs : null
    )

    if (!appt) return res.sendStatus(200)

    const response = isYes ? 'yes' : 'no'
    appt.confirmation.response = response
    appt.confirmation.respondedAt = new Date()
    if (isNo) appt.status = 'cancelled'
    await appt.save()

    await notifyOwnerOfResponse(appt._id, response).catch(console.error)
    res.sendStatus(200)
  } catch (err) {
    console.error('[Webhook]', err.message)
    res.sendStatus(200) // sempre 200 para o Evolution API não retentar
  }
})

export default router
