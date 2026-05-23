import 'dotenv/config'
import app from './src/app.js'
import mongoose from 'mongoose'

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sobrancelhas'

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    const host = mongoose.connection.host
    console.log(`✅ MongoDB conectado — ${host}`)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err.message)
    process.exit(1)
  })
