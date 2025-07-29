import { FastifyInstance } from 'fastify';
import { registerAuthRoutes } from './auth';
import { registerTemplateRoutes } from './templates';
import { registerOrderRoutes } from './orders';
import { registerLicenseRoutes } from './licenses';
import { registerCartRoutes } from './cart';
import { registerAnalyticsRoutes } from './analytics';
import { registerStripeRoutes } from './stripe';
import { registerUserRoutes } from './users';
import { registerCategoryRoutes } from './categories';
import { registerTagRoutes } from './tags';
import { registerDownloadRoutes } from './downloads';
import { registerReviewRoutes } from './reviews';
import { registerFavoriteRoutes } from './favorites';
import { registerTestRoutes } from './test';

export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Register all route modules with their prefixes
  await fastify.register(registerAuthRoutes, { prefix: '/auth' });
  await fastify.register(registerTemplateRoutes, { prefix: '/templates' });
  await fastify.register(registerOrderRoutes, { prefix: '/orders' });
  await fastify.register(registerLicenseRoutes, { prefix: '/licenses' });
  await fastify.register(registerCartRoutes, { prefix: '/cart' });
  await fastify.register(registerAnalyticsRoutes, { prefix: '/analytics' });
  await fastify.register(registerStripeRoutes, { prefix: '/stripe' });
  await fastify.register(registerUserRoutes, { prefix: '/users' });
  await fastify.register(registerCategoryRoutes, { prefix: '/categories' });
  await fastify.register(registerTagRoutes, { prefix: '/tags' });
  await fastify.register(registerDownloadRoutes, { prefix: '/downloads' });
  await fastify.register(registerReviewRoutes, { prefix: '/reviews' });
  await fastify.register(registerFavoriteRoutes, { prefix: '/favorites' });
  await fastify.register(registerTestRoutes, { prefix: '/test' });

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}; 