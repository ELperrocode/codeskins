import { FastifyInstance } from 'fastify';

export const registerTestRoutes = (fastify: FastifyInstance): void => {
  fastify.get('/test', async () => {
    return { success: true, message: 'Test route working' };
  });

  fastify.post('/test', async () => {
    return { success: true, message: 'Test POST route working' };
  });

  fastify.get('/env', async () => {
    return { 
      success: true, 
      stripeKey: process.env['STRIPE_SECRET_KEY'] ? 'Set' : 'Not set',
      frontendUrl: process.env['FRONTEND_URL'],
      nodeEnv: process.env['NODE_ENV']
    };
  });
}; 