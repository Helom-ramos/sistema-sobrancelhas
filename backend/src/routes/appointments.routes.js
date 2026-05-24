import { Router } from 'express'
import Appointment from '../models/Appointment.js'
import Client from '../models/Client.js'
import Service from '../models/Service.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { sendBookingConfirmation, sendCancellationNotification } from '../services/whatsapp.service.js'

const router = Router()

// Público: criar agendamento (cliente)
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, serviceId, date, time, notes } = req.body
    if (!name || !phone || !serviceId || !date || !time) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' })
    }

    const service = await Service.findById(serviceId)
    if (!service || !service.active) return res.status(400).json({ error: 'Serviço indisponível' })

    // Upsert do cliente pelo telefone
    let client = await Client.findOneAndUpdate(
      { phone },
      { name, phone },
      { upsert: true, new: true }
    )

    const datetime = new Date(`${date}T${time}:00-03:00`)
    const endDatetime = new Date(datetime.getTime() + service.duration * 60000)

    // Verificar conflito de horário (race condition entre múltiplos clientes)
    const conflict = await Appointment.findOne({
      datetime: { $lt: endDatetime },
      endDatetime: { $gt: datetime },
      status: { $nin: ['cancelled'] }
    })
    if (conflict) {
      return res.status(409).json({ error: 'Este horário não está mais disponível. Por favor, escolha outro horário.' })
    }

    const appointment = await Appointment.create({
      client: client._id,
      service: service._id,
      datetime,
      endDatetime,
      notes,
      createdBy: 'client'
    })

    // Envia WhatsApp (não bloqueia a resposta)
    sendBookingConfirmation(appointment._id).catch(console.error)

    res.status(201).json({ id: appointment._id, message: 'Agendamento criado com sucesso!' })
  } catch (err) { next(err) }
})

// Admin: listar agendamentos
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { date, startDate, endDate, status } = req.query
    const filter = {}
    if (startDate && endDate) {
      filter.datetime = {
        $gte: new Date(`${startDate}T00:00:00-03:00`),
        $lte: new Date(`${endDate}T23:59:59-03:00`)
      }
    } else if (date) {
      const start = new Date(`${date}T00:00:00-03:00`)
      const end = new Date(`${date}T23:59:59-03:00`)
      filter.datetime = { $gte: start, $lte: end }
    }
    if (status) filter.status = status

    const appointments = await Appointment.find(filter)
      .populate('client')
      .populate('service')
      .sort({ datetime: 1 })
    res.json(appointments)
  } catch (err) { next(err) }
})

// Público: cancelar agendamento via link
router.post('/:id/cancel', async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate('client service')
    if (!appt) return res.status(404).json({ error: 'Agendamento não encontrado' })
    if (appt.status === 'cancelled') return res.status(400).json({ error: 'Agendamento já cancelado' })
    if (appt.status === 'completed') return res.status(400).json({ error: 'Agendamento já realizado' })
    if (new Date(appt.datetime) < new Date()) return res.status(400).json({ error: 'Não é possível cancelar um agendamento passado' })

    appt.status = 'cancelled'
    await appt.save()

    sendCancellationNotification(appt._id).catch(console.error)

    res.json({ message: 'Agendamento cancelado com sucesso' })
  } catch (err) { next(err) }
})

// Público: buscar agendamento por ID (para página de cancelamento)
router.get('/:id/public', async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate('client service')
    if (!appt) return res.status(404).json({ error: 'Agendamento não encontrado' })
    res.json({
      _id: appt._id,
      status: appt.status,
      datetime: appt.datetime,
      service: { name: appt.service.name, price: appt.service.price, duration: appt.service.duration },
      client: { name: appt.client.name }
    })
  } catch (err) { next(err) }
})

// Admin: atualizar status
router.patch('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('client service')
    if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' })
    res.json(appointment)
  } catch (err) { next(err) }
})

export default router
