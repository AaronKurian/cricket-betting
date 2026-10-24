import User from '../models/User.js'

export async function bootstrapAdmin() {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

  if (!configuredEmail) {
    return
  }

  const existingAdmin = await User.exists({ role: 'admin' })
  if (existingAdmin) {
    return
  }

  await User.findOneAndUpdate(
    { email: configuredEmail, role: 'player' },
    { $set: { role: 'admin' } },
  )
}
