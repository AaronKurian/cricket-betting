import express from 'express'
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (request, response) => {
  const users = await User.find({ role: 'player' }).select('_id name').lean()
  const userIds = users.map((user) => user._id)
  const wallets = await Wallet.find({ user: { $in: userIds } }).select('user balance').lean()
  const balances = new Map(wallets.map((wallet) => [wallet.user.toString(), wallet.balance]))

  const leaderboard = users
    .map((user) => ({
      userId: user._id.toString(),
      name: user.name,
      balance: balances.get(user._id.toString()) || 0,
      isCurrentUser: user._id.toString() === request.user._id.toString(),
    }))
    .sort((first, second) => {
      if (second.balance !== first.balance) return second.balance - first.balance
      const nameOrder = first.name.localeCompare(second.name)
      return nameOrder || first.userId.localeCompare(second.userId)
    })
    .map(({ userId: _userId, ...user }, index) => ({ ...user, rank: index + 1 }))

  return response.json({
    metric: 'balance',
    metricLabel: 'Virtual credits',
    leaderboard,
  })
})

export default router
