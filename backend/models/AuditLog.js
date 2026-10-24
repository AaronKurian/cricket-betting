import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['match', 'user'],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
)

auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ action: 1, createdAt: -1 })

const AuditLog = mongoose.model('AuditLog', auditLogSchema)

export async function recordAudit({ actor, action, targetType, targetId, details = {}, session }) {
  const options = session ? { session } : undefined

  await AuditLog.create(
    [{ actor, action, targetType, targetId: targetId.toString(), details }],
    options,
  )
}

export default AuditLog
