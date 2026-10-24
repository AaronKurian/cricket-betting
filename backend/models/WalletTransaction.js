import mongoose from 'mongoose'

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reference: {
      type: String,
    },
    type: {
      type: String,
      enum: ['signup_bonus', 'prediction_stake', 'prediction_payout', 'prediction_refund'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

walletTransactionSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('WalletTransaction', walletTransactionSchema)
