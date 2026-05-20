import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Service from '../models/Service.js'
import Client from '../models/Client.js'
import Settings from '../models/Settings.js'

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sobrancelhas')

await Promise.all([User.deleteMany(), Service.deleteMany(), Client.deleteMany(), Settings.deleteMany()])

await User.create({ name: 'Proprietária', email: 'admin@sobrancelhas.com', password: 'admin123456' })

await Service.insertMany([
  { name: 'Design de Sobrancelha', description: 'Modelagem personalizada com linha e pinça para valorizar o seu olhar.', duration: 45, price: 55, active: true },
  { name: 'Henna de Sobrancelha', description: 'Coloração natural com henna que dura até 4 semanas. Inclui design.', duration: 60, price: 75, active: true },
  { name: 'Micropigmentação', description: 'Técnica semipermanente que preenche falhas e define o contorno.', duration: 120, price: 350, active: true },
  { name: 'Brow Lamination', description: 'Alinhamento e nutrição dos fios para um efeito penteado duradouro.', duration: 90, price: 120, active: true },
])

await Client.insertMany([
  { name: 'Maria Silva', phone: '5511991234567' },
  { name: 'Ana Souza', phone: '5511987654321' },
  { name: 'Julia Oliveira', phone: '5511999887766' },
])

await Settings.create({})

console.log('✅ Seed concluído com sucesso!')
console.log('📧 Login admin: admin@sobrancelhas.com | Senha: admin123456')
await mongoose.disconnect()
