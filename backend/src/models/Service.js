import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    duration: { type: Number, required: true, min: 15 }, // minutos
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: null }, // URL relativa ex: /uploads/design.jpg
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default mongoose.model('Service', serviceSchema)
