import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)
const Appointment = (await import('./src/models/Appointment.js')).default
await import('./src/models/Client.js')
await import('./src/models/Service.js')

// Busca todos os agendamentos não cancelados, ordenados do mais antigo
const all = await Appointment.find({ status: { $nin: ['cancelled'] } })
  .populate('client', 'name phone')
  .populate('service', 'name duration')
  .sort({ datetime: 1 })

console.log(`\n📋 Total de agendamentos ativos: ${all.length}\n`)

const toRemove = []
const kept = []

for (const appt of all) {
  // Verifica se conflita com algum que já foi mantido
  const conflict = kept.find(k =>
    appt.datetime < k.endDatetime && appt.endDatetime > k.datetime
  )

  if (conflict) {
    console.log(`❌ CONFLITO ENCONTRADO:`)
    console.log(`   MANTER  → [${conflict._id}] ${conflict.client?.name} | ${conflict.service?.name} | ${new Date(conflict.datetime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} → ${new Date(conflict.endDatetime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`)
    console.log(`   REMOVER → [${appt._id}] ${appt.client?.name} | ${appt.service?.name} | ${new Date(appt.datetime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} → ${new Date(appt.endDatetime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`)
    toRemove.push(appt._id)
  } else {
    kept.push(appt)
  }
}

console.log(`\n📊 Resultado:`)
console.log(`   Conflitos encontrados: ${toRemove.length}`)
console.log(`   Agendamentos a manter: ${kept.length}`)

if (toRemove.length === 0) {
  console.log('\n✅ Nenhum conflito encontrado. Banco está limpo!')
} else {
  console.log(`\n🗑️  Cancelando ${toRemove.length} agendamento(s) duplicado(s)...`)
  const result = await Appointment.updateMany(
    { _id: { $in: toRemove } },
    { status: 'cancelled' }
  )
  console.log(`✅ ${result.modifiedCount} agendamento(s) marcados como cancelado.`)
}

await mongoose.disconnect()
console.log('\n✅ Concluído!')
