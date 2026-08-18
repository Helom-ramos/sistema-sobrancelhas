import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

function isAuthenticated(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return false
  try {
    jwt.verify(auth.slice(7), process.env.JWT_SECRET)
    return true
  } catch {
    return false
  }
}

router.get('/', async (req, res, next) => {
  try {
    const settings = await Settings.findOne() || await Settings.create({})
    if (isAuthenticated(req)) return res.json(settings)

    const { salonName, phone, address, instagram } = settings
    res.json({ salonName, phone, address, instagram })
  } catch (err) { next(err) }
})

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const body = { ...req.body }
    if (body.reminderMinutesBefore !== undefined) {
      const n = Math.round(Number(body.reminderMinutesBefore))
      body.reminderMinutesBefore = Math.min(1440, Math.max(5, Number.isFinite(n) ? n : 30))
    }
    const settings = await Settings.findOneAndUpdate({}, body, { new: true, upsert: true })
    res.json(settings)
  } catch (err) { next(err) }
})

export default router
