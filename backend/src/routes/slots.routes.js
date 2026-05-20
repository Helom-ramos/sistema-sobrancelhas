import { Router } from 'express'
import { getAvailableSlots } from '../controllers/slots.controller.js'

const router = Router()

// GET /api/slots?date=2025-06-15&serviceId=abc123
router.get('/', getAvailableSlots)

export default router
