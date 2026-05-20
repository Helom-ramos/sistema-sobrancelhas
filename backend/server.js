import 'dotenv/config'
import app from './src/app.js'
import mongoose from 'mongoose'

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sobrancelhas'

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado')
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err.message)
    process.exit(1)
  })
