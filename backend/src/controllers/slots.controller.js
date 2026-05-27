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

    const targetDate = new Date(`${date}T00:00:00-03:00`)
    const dayOfWeek = targetDate.getDay()
    const dayConfig = settings.workingHours.find(h => h.day === dayOfWeek)

    if (!dayConfig?.active) return res.json([])

    const toMinutes = (str) => { const [h, m] = str.split(':').map(Number); return h * 60 + m }

    // Monta turnos: se houver intervalo, divide em manhã + tarde
    const shifts = dayConfig.breakStart && dayConfig.breakEnd
      ? [
          { start: toMinutes(dayConfig.start),    end: toMinutes(dayConfig.breakStart) },
          { start: toMinutes(dayConfig.breakEnd),  end: toMinutes(dayConfig.end) }
        ]
      : [{ start: toMinutes(dayConfig.start), end: toMinutes(dayConfig.end) }]

    // Gera slots para cada turno
    const slotInterval = service.duration + settings.breakBetweenAppointments
    const slots = []
    for (const shift of shifts) {
      for (let m = shift.start; m + service.duration <= shift.end; m += slotInterval) {
        const h = Math.floor(m / 60).toString().padStart(2, '0')
        const min = (m % 60).toString().padStart(2, '0')
        slots.push(`${h}:${min}`)
      }
    }

    // Busca agendamentos existentes no dia
    const dayStart = new Date(`${date}T00:00:00-03:00`)
    const dayEnd = new Date(`${date}T23:59:59-03:00`)
    const existing = await Appointment.find({
      datetime: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ['cancelled'] }
    }).populate('service')

    // Remove slots com conflito — usa offset BRT fixo para bater com o UTC armazenado
    const available = slots.filter(slot => {
      const slotStart = new Date(`${date}T${slot}:00-03:00`)
      const slotEnd = new Date(slotStart.getTime() + service.duration * 60000)

      return !existing.some(appt => {
        return slotStart < appt.endDatetime && slotEnd > appt.datetime
      })
    })

    res.json(available)
  } catch (err) { next(err) }
}
