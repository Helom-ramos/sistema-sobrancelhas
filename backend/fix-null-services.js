import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)
const Appointment = (await import('./src/models/Appointment.js')).default
await import('./src/models/Client.js')
await import('./src/models/Service.js')

// Busca agendamentos onde o service não existe mais na coleção
const all = await Appointment.find({}).populate('service')
const nullService = all.filter(a => !a.service)

console.log(`\n📋 Agendamentos com serviço removido: ${nullService.length}`)
nullService.forEach(a => {
  console.log(`  [${a._id}] status: ${a.status} | data: ${new Date(a.datetime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`)
})

if (nullService.length === 0) {
  console.log('✅ Nenhum agendamento órfão encontrado.')
} else {
  const ids = nullService.map(a => a._id)
  const result = await Appointment.updateMany(
    { _id: { $in: ids } },
    { status: 'cancelled' }
  )
  console.log(`\n✅ ${result.modifiedCount} agendamento(s) com serviço removido marcados como cancelado.`)
}

await mongoose.disconnect()
console.log('✅ Concluído!')
