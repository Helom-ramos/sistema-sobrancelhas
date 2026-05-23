/**
 * Script de migração: MongoDB local → MongoDB Atlas
 * Uso: node migrate-to-atlas.js "mongodb+srv://user:pass@cluster.mongodb.net/sobrancelhas"
 */
import 'dotenv/config'
import mongoose from 'mongoose'

const LOCAL_URI = 'mongodb://localhost:27017/sobrancelhas'
const ATLAS_URI = process.argv[2]

if (!ATLAS_URI) {
  console.error('❌ Informe a URI do Atlas como argumento:')
  console.error('   node migrate-to-atlas.js "mongodb+srv://..."')
  process.exit(1)
}

async function migrate() {
  console.log('🔗 Conectando ao MongoDB local...')
  const local = await mongoose.createConnection(LOCAL_URI).asPromise()

  console.log('🔗 Conectando ao MongoDB Atlas...')
  const atlas = await mongoose.createConnection(ATLAS_URI).asPromise()

  const collections = ['users', 'services', 'clients', 'appointments', 'settings']
  let total = 0

  for (const col of collections) {
    const docs = await local.collection(col).find({}).toArray()
    if (docs.length === 0) {
      console.log(`   ⏭  ${col}: vazio, pulando`)
      continue
    }

    await atlas.collection(col).deleteMany({})
    await atlas.collection(col).insertMany(docs)
    console.log(`   ✅ ${col}: ${docs.length} documentos migrados`)
    total += docs.length
  }

  await local.close()
  await atlas.close()

  console.log(`\n✅ Migração concluída! ${total} documentos transferidos para o Atlas.`)
  console.log('\n📝 Próximo passo: atualize o MONGODB_URI no arquivo backend/.env com a URI do Atlas.')
}

migrate().catch(err => {
  console.error('❌ Erro durante migração:', err.message)
  process.exit(1)
})
