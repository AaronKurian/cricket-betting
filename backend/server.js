import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRouter from './routes/auth.js'
import dashboardRouter from './routes/dashboard.js'
import walletRouter from './routes/wallet.js'
import { bootstrapAdmin } from './services/adminBootstrap.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 5000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/wallet', walletRouter)
app.use('/dashboard', dashboardRouter)

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ error: 'Internal server error.' })
})

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required.')
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required.')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  await bootstrapAdmin()

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

startServer().catch((error) => {
  console.error('Unable to start server:', error.message)
  process.exitCode = 1
})
