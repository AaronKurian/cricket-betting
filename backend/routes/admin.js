import express from 'express'
import mongoose from 'mongoose'
import AuditLog from '../models/AuditLog.js'
import Match from '../models/Match.js'
import Prediction from '../models/Prediction.js'
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import { recordAudit } from '../models/AuditLog.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth, requireRole('admin'))

router.get('/dashboard', async (_request, response) => {
  const [totalUsers, totalMatches, upcomingMatches, liveMatches, predictionStats, walletStats, recentActivity, topPlayers, upcomingMatchList] = await Promise.all([
    User.countDocuments(),
    Match.countDocuments(),
    Match.countDocuments({ status: 'upcoming' }),
    Match.countDocuments({ status: 'live' }),
    Prediction.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Wallet.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } },
    ]),
    AuditLog.find().populate('actor', 'name').sort({ createdAt: -1 }).limit(5),
    Wallet.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'player',
        },
      },
      { $unwind: '$player' },
      { $match: { 'player.role': 'player' } },
      { $sort: { balance: -1, 'player.name': 1, _id: 1 } },
      { $limit: 5 },
      { $project: { _id: 0, userId: '$player._id', name: '$player.name', balance: 1 } },
    ]),
    Match.find({ status: 'upcoming' }).select('_id title scheduledAt').sort({ scheduledAt: 1, _id: 1 }).limit(5),
  ])

  const predictions = Object.fromEntries(predictionStats.map((item) => [item._id, item.count]))

  return response.json({
    statistics: {
      totalUsers,
      totalMatches,
      upcomingMatches,
      liveMatches,
      totalCredits: walletStats[0]?.total || 0,
      totalPredictions: Object.values(predictions).reduce((sum, count) => sum + count, 0),
      pendingPredictions: predictions.pending || 0,
      wonPredictions: predictions.won || 0,
      lostPredictions: predictions.lost || 0,
    },
    topPlayers,
    upcomingMatches: upcomingMatchList,
    recentActivity,
  })
})

router.get('/users', async (request, response) => {
  const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1)
  const limit = Math.min(20, Math.max(1, Number.parseInt(request.query.limit, 10) || 10))
  const filter = {}

  if (['player', 'admin'].includes(request.query.role)) {
    filter.role = request.query.role
  }

  if (request.query.search) {
    filter.$or = [
      { name: { $regex: request.query.search, $options: 'i' } },
      { email: { $regex: request.query.search, $options: 'i' } },
    ]
  }

  const [users, total] = await Promise.all([
    User.find(filter).select('_id name email role createdAt').sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ])

  return response.json({
    users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

router.patch('/users/:id/role', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid user ID.' })
  }

  const { role } = request.body

  if (!['player', 'admin'].includes(role)) {
    return response.status(400).json({ error: 'Role must be player or admin.' })
  }

  const session = await mongoose.startSession()

  try {
    let user

    await session.withTransaction(async () => {
      user = await User.findById(request.params.id).session(session)

      if (!user) {
        const error = new Error('User not found.')
        error.statusCode = 404
        throw error
      }

      if (user.role === role) return

      if (user.role === 'admin' && role === 'player') {
        const adminCount = await User.countDocuments({ role: 'admin' }).session(session)

        if (adminCount <= 1) {
          const error = new Error('The last admin cannot be demoted.')
          error.statusCode = 400
          throw error
        }
      }

      const previousRole = user.role
      user.role = role
      await user.save({ session })

      await recordAudit({
        actor: request.user._id,
        action: 'user_role_changed',
        targetType: 'user',
        targetId: user._id,
        details: { previousRole, role },
        session,
      })
    })

    return response.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    if (error.statusCode) {
      return response.status(error.statusCode).json({ error: error.message })
    }

    throw error
  } finally {
    await session.endSession()
  }
})

router.get('/audit-logs', async (request, response) => {
  const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1)
  const limit = Math.min(20, Math.max(1, Number.parseInt(request.query.limit, 10) || 10))
  const filter = request.query.action ? { action: request.query.action } : {}

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('actor', 'name')
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ])

  return response.json({
    logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

export default router
