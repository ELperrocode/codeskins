import { FastifyInstance } from 'fastify'
import { registerAuthRoutes } from './auth'

export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Register auth routes
  await fastify.register(async (fastify) => {
    registerAuthRoutes(fastify)
  }, { prefix: '/api/auth' })

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
} 