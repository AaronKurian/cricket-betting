import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import WalletTransaction from '../models/WalletTransaction.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()


router.post('/signup', async (request, response) => {
  const { name, email, password } = request.body

  if (!name || !email || !password) {
    return response.status(400).json({ error: 'Name, email, and password are required.' })
  }

  const session = await mongoose.startSession()

  try {
    let user
    const bonus = Number(process.env.SIGNUP_BONUS || 10000)

    await session.withTransaction(async () => {
      const passwordHash = await bcrypt.hash(password, 10)
      const users = await User.create(
        [{ name, email: email.toLowerCase(), passwordHash, role: 'player' }],
        { session },
      )
      user = users[0]
      await Wallet.create([{ user: user._id, balance: bonus }], { session })
      await WalletTransaction.create(
        [{ user: user._id, type: 'signup_bonus', amount: bonus, balanceAfter: bonus, description: 'Signup bonus' }],
        { session },
      )
    })

    const token = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    )
    response.cookie('authtoken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    })
    return response.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ error: 'An account with this email already exists.' })
    }

    console.error(error)
    return response.status(500).json({ error: 'Unable to create your account.' })
  } finally {
    await session.endSession()
  }
})



router.post('/login', async (request, response) => {
  const { email, password } = request.body

  if (!email || !password) {
    return response.status(400).json({ error: 'Email and password are required.' })
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  const validPassword = user && await bcrypt.compare(password, user.passwordHash)

  if (!validPassword) {
    return response.status(401).json({ error: 'Invalid email or password.' })
  }

  const token = jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
  response.cookie('authtoken', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
  return response.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})



router.post('/logout', (_request, response) => {
  response.clearCookie('authtoken', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
  return response.status(204).send()
})



router.get('/me', requireAuth, (request, response) => {
  return response.json({
    user: {
      id: request.user._id,
      name: request.user.name,
      email: request.user.email,
      role: request.user.role,
    },
  })
})

export default router
