import express from 'express'
import mongoose from 'mongoose'
import Match from '../models/Match.js'
import Prediction from '../models/Prediction.js'
import Wallet from '../models/Wallet.js'
import WalletTransaction from '../models/WalletTransaction.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth, requireRole('player'))

router.post('/', async (request, response) => {
  const { matchId, selectedTeam, stake, requestId } = request.body

  if (!mongoose.isValidObjectId(matchId)) {
    return response.status(400).json({ error: 'Invalid match ID.' })
  }

  if (!['teamA', 'teamB'].includes(selectedTeam)) {
    return response.status(400).json({ error: 'Select Team A or Team B.' })
  }

  const numericStake = Number(stake)

  if (!Number.isInteger(numericStake) || numericStake < 1) {
    return response.status(400).json({ error: 'Stake must be a whole number greater than zero.' })
  }

  if (requestId !== undefined && (typeof requestId !== 'string' || !requestId)) {
    return response.status(400).json({ error: 'Invalid request ID.' })
  }

  const session = await mongoose.startSession()
  let prediction

  try {
    await session.withTransaction(async () => {
      if (requestId) {
        prediction = await Prediction.findOne({ user: request.user._id, requestId }).session(session)

        if (prediction) return
      }

      const existingPrediction = await Prediction.findOne({
        user: request.user._id,
        match: matchId,
      }).session(session)

      if (existingPrediction) {
        const error = new Error('You already have a prediction for this match.')
        error.statusCode = 409
        throw error
      }

      const match = await Match.findById(matchId).session(session)

      if (!match) {
        const error = new Error('Match not found.')
        error.statusCode = 404
        throw error
      }

      if (match.status !== 'upcoming') {
        const error = new Error('Predictions are only available for upcoming matches.')
        error.statusCode = 400
        throw error
      }

      const wallet = await Wallet.findOneAndUpdate(
        { user: request.user._id, balance: { $gte: numericStake } },
        { $inc: { balance: -numericStake } },
        { returnDocument: 'after', session },
      )

      if (!wallet) {
        const error = new Error('Insufficient virtual credits.')
        error.statusCode = 400
        throw error
      }

      const predictions = await Prediction.create(
        [{
          user: request.user._id,
          match: match._id,
          selectedTeam,
          stake: numericStake,
          requestId,
        }],
        { session },
      )
      prediction = predictions[0]

      await WalletTransaction.create(
        [{
          user: request.user._id,
          reference: prediction._id.toString(),
          type: 'prediction_stake',
          amount: -numericStake,
          balanceAfter: wallet.balance,
          description: `Prediction stake for ${match.title}`,
        }],
        { session },
      )
    })

    await prediction.populate('match', 'title teamA teamB scheduledAt status winner')
    return response.status(201).json({ prediction })
  } catch (error) {
    if (error.statusCode) {
      return response.status(error.statusCode).json({ error: error.message })
    }

    if (error.code === 11000) {
      return response.status(409).json({ error: 'You already have a prediction for this match.' })
    }

    throw error
  } finally {
    await session.endSession()
  }
})

router.get('/', async (request, response) => {
  const allowedStatuses = ['pending', 'won', 'lost', 'tie']
  const { status } = request.query
  const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1)
  const limit = Math.min(20, Math.max(1, Number.parseInt(request.query.limit, 10) || 5))
  const filter = { user: request.user._id }

  if (status && !allowedStatuses.includes(status)) {
    return response.status(400).json({ error: 'Invalid prediction status filter.' })
  }

  if (status) {
    filter.status = status
  }

  const [predictions, total] = await Promise.all([
    Prediction.find(filter)
    .populate('match', 'title teamA teamB scheduledAt status winner')
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit),
    Prediction.countDocuments(filter),
  ])

  return response.json({
    predictions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
})

router.get('/:id', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid prediction ID.' })
  }

  const prediction = await Prediction.findOne({
    _id: request.params.id,
    user: request.user._id,
  }).populate('match', 'title teamA teamB scheduledAt status winner')

  if (!prediction) {
    return response.status(404).json({ error: 'Prediction not found.' })
  }

  return response.json({ prediction })
})

export default router
