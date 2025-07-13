import { FastifyRequest, FastifyReply } from 'fastify'

export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  // Check if user data exists in session
  const sessionUser = request.session.user
  if (!sessionUser || !sessionUser.id) {
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized: No active session',
    })
  }
} 