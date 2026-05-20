import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { fileURLToPath } from 'url'
import path from 'path'

import authRoutes from './routes/auth.routes.js'
import appointmentRoutes from './routes/appointments.routes.js'
import clientRoutes from './routes/clients.routes.js'
import serviceRoutes from './routes/services.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import slotsRoutes from './routes/slots.routes.js'
import whatsappRoutes from './routes/whatsapp.routes.js'
import { startScheduler } from './services/scheduler.service.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())

// Servir imagens dos serviços
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/slots', slotsRoutes)
app.use('/api/whatsapp', whatsappRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Erro interno' })
})

startScheduler()

export default app
