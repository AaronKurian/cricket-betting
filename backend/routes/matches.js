import express from 'express'
import mongoose from 'mongoose'
import Match from '../models/Match.js'
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
  return response.json({ match })
})

router.patch('/:id/status', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid match ID.' })
  }

  await syncLiveMatches()
  const match = await Match.findById(request.params.id)

  if (!match) {
    return response.status(404).json({ error: 'Match not found.' })
  }

  const { status } = request.body

  if (status !== 'completed') {
    return response.status(400).json({ error: 'Only live matches can be marked completed.' })
  }

  if (match.status !== 'live') {
    return response.status(400).json({ error: `Cannot complete a ${match.status} match.` })
  }

  match.status = status
  await match.save()
  return response.json({ match })
})

export default router
