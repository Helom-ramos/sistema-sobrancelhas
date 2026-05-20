import { Router } from 'express'
import Client from '../models/Client.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    res.json(await Client.find().sort({ name: 1 }))
  } catch (err) { next(err) }
})

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' })
    res.json(client)
  } catch (err) { next(err) }
})

export default router
