import { FastifyInstance } from 'fastify';
import { registerAuthRoutes } from './auth';

export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Register auth routes
  await fastify.register(async (fastify) => {
    registerAuthRoutes(fastify);
  }, { prefix: '/api/auth' });

  // Health check route
  fastify.get('/health', async (_request, reply) => {
    reply.send({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
    })
  })

  // API info route
  fastify.get('/api', async (_request, reply) => {
    reply.send({
      name: 'CodeSkins API',
      version: '1.0.0',
      docs: '/api/docs',
    })
  })
}; 