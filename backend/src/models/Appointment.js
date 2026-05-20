import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    datetime: { type: Date, required: true },    // início, armazenado em UTC
    endDatetime: { type: Date, required: true }, // calculado: datetime + service.duration
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'confirmed'
    },
    notes: { type: String, default: '' },
    createdBy: { type: String, enum: ['admin', 'client'], default: 'client' },
    confirmation: {
      reminderSent: { type: Boolean, default: false },
      response: { type: String, enum: ['yes', 'no', 'no_response', null], default: null },
      respondedAt: { type: Date, default: null }
    }
  },
  { timestamps: true }
)

appointmentSchema.index({ datetime: 1 })
appointmentSchema.index({ status: 1 })
appointmentSchema.index({ 'confirmation.reminderSent': 1, datetime: 1 })

export default mongoose.model('Appointment', appointmentSchema)
