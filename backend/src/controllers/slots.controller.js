import Appointment from '../models/Appointment.js'
import Service from '../models/Service.js'
import Settings from '../models/Settings.js'

export async function getAvailableSlots(req, res, next) {
  try {
    const { date, serviceId } = req.query
    if (!date || !serviceId) return res.status(400).json({ error: 'date e serviceId obrigatórios' })

    const [service, settings] = await Promise.all([
      Service.findById(serviceId),
      Settings.findOne()
    ])
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' })

    // Dia da semana no fuso de Brasília
    const targetDate = new Date(`${date}T00:00:00-03:00`)
    const dayOfWeek = targetDate.getDay()
    const dayConfig = settings.workingHours.find(h => h.day === dayOfWeek)

    if (!dayConfig?.active) return res.json([])

    // Gera todos os slots do dia
    const [startH, startM] = dayConfig.start.split(':').map(Number)
    const [endH, endM] = dayConfig.end.split(':').map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM
    const slotInterval = service.duration + settings.breakBetweenAppointments

    const slots = []
    for (let m = startMinutes; m + service.duration <= endMinutes; m += slotInterval) {
      const h = Math.floor(m / 60).toString().padStart(2, '0')
      const min = (m % 60).toString().padStart(2, '0')
      slots.push(`${h}:${min}`)
    }

    // Busca agendamentos existentes no dia
    const dayStart = new Date(`${date}T00:00:00-03:00`)
    const dayEnd = new Date(`${date}T23:59:59-03:00`)
    const existing = await Appointment.find({
      datetime: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ['cancelled'] }
    }).populate('service')

    // Remove slots com conflito
    const available = slots.filter(slot => {
      const [h, m] = slot.split(':').map(Number)
      const slotStart = new Date(dayStart)
      slotStart.setHours(h, m, 0, 0)
      const slotEnd = new Date(slotStart.getTime() + service.duration * 60000)

      return !existing.some(appt => {
        return slotStart < appt.endDatetime && slotEnd > appt.datetime
      })
    })

    res.json(available)
  } catch (err) { next(err) }
}
