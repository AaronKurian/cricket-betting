import mongoose from 'mongoose'

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    selectedTeam: {
      type: String,
      enum: ['teamA', 'teamB'],
      required: true,
    },
    stake: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'won', 'lost', 'void'],
      default: 'pending',
    },
    actualPayout: {
      type: Number,
      default: 0,
      min: 0,
    },
    requestId: {
      type: String,
    },
  },
  { timestamps: true },
)

predictionSchema.index({ user: 1, createdAt: -1 })
predictionSchema.index({ match: 1, createdAt: -1 })
predictionSchema.index({ user: 1, match: 1 }, { unique: true })
predictionSchema.index({ user: 1, requestId: 1 }, { unique: true, sparse: true })

export default mongoose.model('Prediction', predictionSchema)
