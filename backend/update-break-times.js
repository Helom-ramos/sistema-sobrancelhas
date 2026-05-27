import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)
const Settings = (await import('./src/models/Settings.js')).default

const settings = await Settings.findOne()
if (!settings) { console.log('❌ Settings não encontrado.'); process.exit(1) }

// Sexta (day=5): intervalo 12:30 → 14:30
const sex = settings.workingHours.find(h => h.day === 5)
if (sex) { sex.breakStart = '12:30'; sex.breakEnd = '14:30' }

// Sábado (day=6): intervalo 12:30 → 13:30
const sab = settings.workingHours.find(h => h.day === 6)
if (sab) { sab.breakStart = '12:30'; sab.breakEnd = '13:30' }

settings.markModified('workingHours')
await settings.save()

console.log('✅ Intervalos atualizados:')
console.log(`  Sexta  → ${sex?.breakStart} às ${sex?.breakEnd}`)
console.log(`  Sábado → ${sab?.breakStart} às ${sab?.breakEnd}`)

await mongoose.disconnect()
