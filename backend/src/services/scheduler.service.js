import cron from 'node-cron'
import Appointment from '../models/Appointment.js'
import Settings from '../models/Settings.js'
import { sendPresenceCheck, notifyOwnerOfResponse } from './whatsapp.service.js'

export function startScheduler() {
  // Roda a cada minuto
  cron.schedule('* * * * *', async () => {
    try {
      const settings = await Settings.findOne()
      const reminderMin = settings?.reminderMinutesBefore ?? 30
      const noRespMin = settings?.noResponseAlertMinutes ?? 15

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

      // 2. Alertar proprietária se cliente não respondeu em 15min
      const noRespCutoff = new Date(now.getTime() - noRespMin * 60000)
      const noResponse = await Appointment.find({
        'confirmation.reminderSent': true,
        'confirmation.response': null,
        datetime: { $gte: now },
        updatedAt: { $lte: noRespCutoff }
      })
      for (const appt of noResponse) {
        appt.confirmation.response = 'no_response'
        await appt.save()
        await notifyOwnerOfResponse(appt._id, 'no_response').catch(console.error)
      }
    } catch (err) {
      console.error('[Scheduler]', err.message)
    }
  })

  console.log('⏰ Scheduler de WhatsApp iniciado')
}
