import express from 'express'
import Wallet from '../models/Wallet.js'
import WalletTransaction from '../models/WalletTransaction.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (request, response) => {
  const wallet = await Wallet.findOne({ user: request.user._id }).select('balance')
  const recentTransactions = await WalletTransaction.find({ user: request.user._id })
    .sort({ createdAt: -1 })
    .limit(5)

  return response.json({
    user: {
      name: request.user.name,
      email: request.user.email,
    },
    balance: wallet?.balance || 0,
    statistics: {
      totalPredictions: 0,
      correctPredictions: 0,
      winRate: 0,
    },
    upcomingMatches: [],
    recentPredictions: [],
    recentTransactions,
  })
})

export default router
