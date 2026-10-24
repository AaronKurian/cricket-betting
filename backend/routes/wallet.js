import express from 'express'
import Wallet from '../models/Wallet.js'
import WalletTransaction from '../models/WalletTransaction.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (request, response) => {
  const wallet = await Wallet.findOne({ user: request.user._id }).select('balance createdAt updatedAt')

  if (!wallet) {
    return response.status(404).json({ error: 'Wallet not found.' })
  }

  return response.json({ wallet })
})

router.get('/transactions', requireAuth, async (request, response) => {
  const page = Number(request.query.page) || 1
  const limit = Number(request.query.limit) || 10
  const skip = (page - 1) * limit
  const filter = { user: request.user._id }

  const [transactions, total] = await Promise.all([
    WalletTransaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    WalletTransaction.countDocuments(filter),
  ])

  return response.json({
    transactions,
    pagination: { page, limit, total },
  })
})

export default router
