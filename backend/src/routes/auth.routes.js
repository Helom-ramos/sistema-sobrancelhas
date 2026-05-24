import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' })

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '8h')
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn })

    res.json({ token, user })
  } catch (err) { next(err) }
})

export default router
