import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import Service from '../models/Service.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  }
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB

const router = Router()

// Público: lista serviços ativos (para a página de agendamento)
router.get('/', async (_req, res, next) => {
  try {
    const services = await Service.find({ active: true }).sort({ name: 1 })
    res.json(services)
  } catch (err) { next(err) }
})

// Admin: lista todos os serviços (incluindo inativos)
router.get('/all', requireAuth, async (_req, res, next) => {
  try {
    res.json(await Service.find().sort({ name: 1 }))
  } catch (err) { next(err) }
})

// Admin: criar serviço com upload de imagem
router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const { name, description, duration, price } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null
    const service = await Service.create({ name, description, duration: +duration, price: +price, image })
    res.status(201).json(service)
  } catch (err) { next(err) }
})

// Admin: editar serviço
router.put('/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const update = { ...req.body, duration: +req.body.duration, price: +req.body.price }
    if (req.file) update.image = `/uploads/${req.file.filename}`
    const service = await Service.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' })
    res.json(service)
  } catch (err) { next(err) }
})

// Admin: ativar/desativar serviço
router.patch('/:id/toggle', requireAuth, async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' })
    service.active = !service.active
    await service.save()
    res.json(service)
  } catch (err) { next(err) }
})

export default router
