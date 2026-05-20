import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }, // formato: 5511999999999
    email: { type: String, trim: true, lowercase: true, default: null },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
)

clientSchema.index({ phone: 1 }, { unique: true })

export default mongoose.model('Client', clientSchema)
