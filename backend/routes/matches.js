import express from 'express'
import mongoose from 'mongoose'
import Match from '../models/Match.js'
import Prediction from '../models/Prediction.js'
import Wallet from '../models/Wallet.js'
import WalletTransaction from '../models/WalletTransaction.js'
import { recordAudit } from '../models/AuditLog.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
function readMatchFields(body) {
  const { title, teamA, teamB, scheduledAt } = body
  return { title, teamA, teamB, scheduledAt }
}

function validateMatchFields(fields) {
  if (![fields.title, fields.teamA, fields.teamB].every((value) => typeof value === 'string')) {
    return 'Title and team names must be text.'
  }

  if (!fields.title || !fields.teamA || !fields.teamB || !fields.scheduledAt) {
    return 'Title, teams, and scheduled time are required.'
  }

  if (fields.teamA === fields.teamB) {
    return 'Team names must be different.'
  }

  if (Number.isNaN(new Date(fields.scheduledAt).getTime())) {
    return 'Scheduled time must be a valid date.'
  }

  return null
}

function validateScores(scores) {
  if (!scores || !Number.isInteger(scores.teamA) || !Number.isInteger(scores.teamB)) {
    return 'Both team scores must be whole numbers.'
  }

  if (scores.teamA < 0 || scores.teamB < 0) {
    return 'Scores cannot be negative.'
  }

  return null
}

export async function syncLiveMatches() {
  return Match.updateMany(
    { status: 'upcoming', scheduledAt: { $lte: new Date() } },
    { $set: { status: 'live' } },
  )
}

router.use(requireAuth)

router.get('/', async (_request, response) => {
  await syncLiveMatches()
  const matches = await Match.find().sort({ scheduledAt: 1 })
  return response.json({ matches })
})

router.get('/:id', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid match ID.' })
  }

  await syncLiveMatches()
  const match = await Match.findById(request.params.id)

  if (!match) {
    return response.status(404).json({ error: 'Match not found.' })
  }

  return response.json({ match })
})

router.use(requireRole('admin'))

router.post('/', async (request, response) => {
  const fields = readMatchFields(request.body)
  const validationError = validateMatchFields(fields)

  if (validationError) {
    return response.status(400).json({ error: validationError })
  }

  const match = await Match.create(fields)
  await recordAudit({
    actor: request.user._id,
    action: 'match_created',
    targetType: 'match',
    targetId: match._id,
    details: { title: match.title },
  })
  return response.status(201).json({ match })
})

router.patch('/:id', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid match ID.' })
  }

  const match = await Match.findById(request.params.id)

  if (!match) {
    return response.status(404).json({ error: 'Match not found.' })
  }

  if (match.status === 'completed') {
    return response.status(400).json({ error: 'Completed matches cannot be edited.' })
  }

  const fields = readMatchFields({ ...match.toObject(), ...request.body })
  const validationError = validateMatchFields(fields)

  if (validationError) {
    return response.status(400).json({ error: validationError })
  }

  Object.assign(match, fields)
  await match.save()
  await recordAudit({
    actor: request.user._id,
    action: 'match_updated',
    targetType: 'match',
    targetId: match._id,
    details: { title: match.title },
  })
  return response.json({ match })
})

router.patch('/:id/score', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid match ID.' })
  }

  const match = await Match.findById(request.params.id)

  if (!match) {
    return response.status(404).json({ error: 'Match not found.' })
  }

  if (match.status === 'completed') {
    return response.status(400).json({ error: 'Completed match scores cannot be changed.' })
  }

  const validationError = validateScores(request.body.scores)

  if (validationError) {
    return response.status(400).json({ error: validationError })
  }

  match.scores = request.body.scores
  await match.save()
  await recordAudit({
    actor: request.user._id,
    action: 'match_score_updated',
    targetType: 'match',
    targetId: match._id,
    details: { scores: match.scores },
  })
  return response.json({ match })
})

router.patch('/:id/status', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid match ID.' })
  }

  if (request.body.status !== 'completed') {
    return response.status(400).json({ error: 'Only live matches can be marked completed.' })
  }

  await syncLiveMatches()

  const session = await mongoose.startSession()
  let settledCount = 0

  try {
    await session.withTransaction(async () => {
      const match = await Match.findOneAndUpdate(
        { _id: request.params.id, status: 'live', winner: null },
        { $set: { status: 'completed' } },
        { returnDocument: 'after', session },
      )

      if (!match) {
        const currentMatch = await Match.findById(request.params.id).session(session)

        if (!currentMatch) {
          const error = new Error('Match not found.')
          error.statusCode = 404
          throw error
        }

        if (currentMatch.status !== 'live') {
          const error = new Error(`Cannot complete a ${currentMatch.status} match.`)
          error.statusCode = 400
          throw error
        }

        const error = new Error('This match has already been completed.')
        error.statusCode = 409
        throw error
      }

      const winner = match.scores.teamA === match.scores.teamB
        ? 'tie'
        : match.scores.teamA > match.scores.teamB ? 'teamA' : 'teamB'

      match.winner = winner
      await match.save({ session })

      const predictions = await Prediction.find({ match: match._id, status: 'pending' }).session(session)
      settledCount = predictions.length

      for (const prediction of predictions) {
        const isTie = winner === 'tie'
        const won = !isTie && prediction.selectedTeam === winner
        const payout = isTie ? prediction.stake : won ? prediction.stake * 2 : 0

        prediction.status = isTie ? 'tie' : won ? 'won' : 'lost'
        prediction.actualPayout = payout
        await prediction.save({ session })

        if (payout > 0) {
          const wallet = await Wallet.findOneAndUpdate(
            { user: prediction.user },
            { $inc: { balance: payout } },
            { returnDocument: 'after', session },
          )

          if (!wallet) {
            const error = new Error('Wallet not found for a prediction refund or payout.')
            error.statusCode = 500
            throw error
          }

          await WalletTransaction.create(
            [{
              user: prediction.user,
              reference: prediction._id.toString(),
              type: isTie ? 'prediction_refund' : 'prediction_payout',
              amount: payout,
              balanceAfter: wallet.balance,
              description: `${isTie ? 'Refund for' : 'Payout for'} ${match.title}`,
            }],
            { session },
          )
        }
      }

      await recordAudit({
        actor: request.user._id,
        action: 'match_settled',
        targetType: 'match',
        targetId: match._id,
        details: { winner, scores: match.scores, settledCount },
        session,
      })
    })

    const match = await Match.findById(request.params.id)
    return response.json({ match, settledCount })
  } catch (error) {
    if (error.statusCode) {
      return response.status(error.statusCode).json({ error: error.message })
    }

    throw error
  } finally {
    await session.endSession()
  }
})

export default router
