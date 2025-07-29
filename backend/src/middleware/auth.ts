import { FastifyRequest, FastifyReply } from 'fastify'
import { User } from '../models/User'

interface AuthenticatedRequest extends FastifyRequest {
  user?: any;
  session: any;
}

export const authenticate = async (request: AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    // Check if user data exists in session
    const sessionUser = request.session?.user
    if (!sessionUser || !sessionUser.id) {
      return reply.status(401).send({
        success: false,
        message: 'Unauthorized: No active session',
      })
    }

    // Fetch user from database
    const user = await User.findById(sessionUser.id).select('-password')
    if (!user || !user.isActive) {
      return reply.status(401).send({
        success: false,
        message: 'Unauthorized: User not found or inactive',
      })
    }

    // Attach user to request
    request.user = user
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: 'Authentication error',
    })
  }
} 