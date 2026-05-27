import mongoose from 'mongoose'

const workingHourSchema = new mongoose.Schema({
  day: { type: Number, min: 0, max: 6 }, // 0=Dom, 1=Seg ... 6=Sáb
  start: { type: String, default: '09:00' },
  end: { type: String, default: '18:00' },
  breakStart: { type: String, default: '' }, // início do intervalo (ex: '12:30')
  breakEnd: { type: String, default: '' },   // fim do intervalo (ex: '14:30')
  active: { type: Boolean, default: true }
}, { _id: false })

const settingsSchema = new mongoose.Schema(
  {
    salonName: { type: String, default: 'Studio de Sobrancelhas' },
    phone: { type: String, default: '' },       // WhatsApp da proprietária (5511...)
    address: { type: String, default: '' },
    instagram: { type: String, default: '' },
    workingHours: { type: [workingHourSchema], default: () => [
      { day: 0, start: '09:00', end: '17:00', active: false }, // Dom
      { day: 1, start: '09:00', end: '18:00', active: true  }, // Seg
      { day: 2, start: '09:00', end: '18:00', active: true  }, // Ter
      { day: 3, start: '09:00', end: '18:00', active: true  }, // Qua
      { day: 4, start: '09:00', end: '18:00', active: true  }, // Qui
      { day: 5, start: '09:00', end: '18:00', active: true  }, // Sex
      { day: 6, start: '09:00', end: '14:00', active: true  }  // Sáb
    ]},
    breakBetweenAppointments: { type: Number, default: 10 }, // minutos de intervalo
    advanceBookingDays: { type: Number, default: 30 },
    reminderMinutesBefore: { type: Number, default: 30 },    // minutos antes para lembrete
    noResponseAlertMinutes: { type: Number, default: 15 }    // aviso à prop. se sem resposta
  },
  { timestamps: true }
)

export default mongoose.model('Settings', settingsSchema)
