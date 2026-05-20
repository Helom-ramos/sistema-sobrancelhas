import { Router } from 'express'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const settings = await Settings.findOne() || await Settings.create({})
    res.json(settings)
  } catch (err) { next(err) }
})

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true })
    res.json(settings)
  } catch (err) { next(err) }
})

export default router
