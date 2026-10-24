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
      enum: ['signup_bonus'],
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

walletTransactionSchema.index({ user: 1, type: 1 }, { unique: true })

export default mongoose.model('WalletTransaction', walletTransactionSchema)
