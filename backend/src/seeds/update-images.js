import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)

const Service = (await import('../models/Service.js')).default

const updates = [
  { name: 'Design de Sobrancelha', image: '/uploads/design-sobrancelha.jpg' },
  { name: 'Henna de Sobrancelha',  image: '/uploads/henna-sobrancelha.jpg' },
  { name: 'Brow Lamination',       image: '/uploads/brow-lamination.jpg' },
  { name: 'Micropigmentação',      image: '/uploads/micropigmentacao.jpg' }
]

for (const u of updates) {
  const r = await Service.findOneAndUpdate({ name: u.name }, { image: u.image }, { new: true })
  console.log(r ? `✅ ${r.name} → ${r.image}` : `❌ Não encontrado: ${u.name}`)
}

await mongoose.disconnect()
