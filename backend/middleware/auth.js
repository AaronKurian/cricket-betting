import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getCookieValue = (request, name) => {
  const cookies = request.headers.cookie?.split(';') || []
  const cookie = cookies.find((item) => item.trim().startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.trim().slice(name.length + 1)) : null
}

export async function requireAuth(request, response, next) {
  try {
    const token = getCookieValue(request, 'authtoken')

    if (!token) {
      return response.status(401).json({ error: 'Authentication required.' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub).select('_id name email role')

    if (!user) {
      return response.status(401).json({ error: 'Authentication required.' })
    }

    request.user = user
    return next()
  } catch {
    return response.status(401).json({ error: 'Authentication required.' })
  }
}

export function requireRole(role) {
  return (request, response, next) => {
    if (request.user?.role !== role) {
      return response.status(403).json({ error: 'You do not have access to this resource.' })
    }

    return next()
  }
}
