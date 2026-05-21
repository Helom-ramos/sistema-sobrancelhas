import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
import { createWriteStream } from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

await mongoose.connect(process.env.MONGODB_URI)
const Service = (await import('../models/Service.js')).default
const Settings = (await import('../models/Settings.js')).default

// ─── Baixar imagem ───────────────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url + '?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        return download(res.headers.location, dest).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', reject)
  })
}

const uploadsDir = path.join(__dirname, '../../../uploads')

// ─── Novos serviços ──────────────────────────────────────────
const services = [
  {
    name: 'Designer de Sobrancelha',
    description: 'Modelagem personalizada com linha e pinça para realçar o seu olhar.',
    duration: 30,
    price: 25,
    imageUrl: 'https://images.pexels.com/photos/6135628/pexels-photo-6135628.jpeg',
    imageFile: 'designer-sobrancelha.jpg'
  },
  {
    name: 'Designer + Henna',
    description: 'Design completo com aplicação de henna para colorir e definir as sobrancelhas.',
    duration: 30,
    price: 35,
    imageUrl: 'https://images.pexels.com/photos/7984968/pexels-photo-7984968.jpeg',
    imageFile: 'designer-henna.jpg'
  },
  {
    name: 'Somente Henna',
    description: 'Coloração natural com henna. Dura até 4 semanas na pele e mais nos fios.',
    duration: 30,
    price: 20,
    imageUrl: 'https://images.pexels.com/photos/10357957/pexels-photo-10357957.jpeg',
    imageFile: 'somente-henna.jpg'
  },
  {
    name: 'Brow Lamination',
    description: 'Alinhamento e fixação dos fios para um efeito penteado duradouro.',
    duration: 60,
    price: 60,
    imageUrl: 'https://images.pexels.com/photos/8826403/pexels-photo-8826403.jpeg',
    imageFile: 'brow-lamination.jpg'
  },
  {
    name: 'Depilação do Buço',
    description: 'Remoção dos pelos do buço com linha ou cera, rápido e eficaz.',
    duration: 30,
    price: 12,
    imageUrl: 'https://images.pexels.com/photos/15764070/pexels-photo-15764070.jpeg',
    imageFile: 'depilacao-buco.jpg'
  }
]

// ─── Baixar imagens ───────────────────────────────────────────
console.log('📥 Baixando imagens...')
for (const s of services) {
  const dest = path.join(uploadsDir, s.imageFile)
  try {
    await download(s.imageUrl, dest)
    console.log(`  ✅ ${s.imageFile}`)
  } catch (e) {
    console.log(`  ❌ ${s.imageFile}: ${e.message}`)
    s.imageFile = null
  }
}

// ─── Limpar serviços antigos e criar novos ────────────────────
console.log('\n🗑️  Removendo serviços antigos...')
await Service.deleteMany({})

console.log('✨ Criando novos serviços...')
for (const s of services) {
  await Service.create({
    name: s.name,
    description: s.description,
    duration: s.duration,
    price: s.price,
    image: s.imageFile ? `/uploads/${s.imageFile}` : null,
    active: true
  })
  console.log(`  ✅ ${s.name} — R$ ${s.price}`)
}

// ─── Atualizar horários ───────────────────────────────────────
console.log('\n🕐 Atualizando horários...')
await Settings.findOneAndUpdate({}, {
  workingHours: [
    { day: 0, active: false, start: '09:00', end: '18:00', start2: '', end2: '' },   // Dom — fechado
    { day: 1, active: true,  start: '16:00', end: '19:00', start2: '', end2: '' },   // Seg
    { day: 2, active: true,  start: '16:00', end: '19:00', start2: '', end2: '' },   // Ter
    { day: 3, active: true,  start: '16:00', end: '19:00', start2: '', end2: '' },   // Qua
    { day: 4, active: true,  start: '16:00', end: '19:00', start2: '', end2: '' },   // Qui
    { day: 5, active: true,  start: '10:00', end: '12:00', start2: '15:00', end2: '19:00' }, // Sex
    { day: 6, active: true,  start: '10:00', end: '12:00', start2: '15:00', end2: '19:00' }, // Sáb
  ]
}, { upsert: true, new: true })
console.log('  ✅ Seg–Qui: 16h–19h')
console.log('  ✅ Sex–Sáb: 10h–12h e 15h–19h')

await mongoose.disconnect()
console.log('\n🎉 Concluído!')
