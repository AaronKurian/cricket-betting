import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    teamA: {
      type: String,
      required: true,
    },
    teamB: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    scores: {
      teamA: {
        type: Number,
        default: 0,
      },
      teamB: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed'],
      default: 'upcoming',
    },
  },
  { timestamps: true },
)

matchSchema.index({ status: 1, scheduledAt: 1 })

export default mongoose.model('Match', matchSchema)
