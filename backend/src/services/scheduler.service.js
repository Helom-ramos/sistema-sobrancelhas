import cron from 'node-cron'
import Appointment from '../models/Appointment.js'
import Settings from '../models/Settings.js'
import { sendPresenceCheck } from './whatsapp.service.js'

export function startScheduler() {
  // Roda a cada minuto
  cron.schedule('* * * * *', async () => {
    try {
      const settings = await Settings.findOne()
      const reminderMin = settings?.reminderMinutesBefore ?? 30

      const now = new Date()

      // 1. Enviar lembrete 30min antes
      const reminderTarget = new Date(now.getTime() + reminderMin * 60000)
      const toRemind = await Appointment.find({
        datetime: { $gte: now, $lte: new Date(reminderTarget.getTime() + 60000) },
        status: 'confirmed',
        'confirmation.reminderSent': false
      })
      for (const appt of toRemind) {
        await sendPresenceCheck(appt._id).catch(console.error)
      }

    } catch (err) {
      console.error('[Scheduler]', err.message)
    }
  })

  console.log('⏰ Scheduler de WhatsApp iniciado')
}
