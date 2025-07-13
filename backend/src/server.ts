import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import { config } from 'dotenv'
import { connectDatabase, disconnectDatabase } from './config/database'
import { registerRoutes } from './routes'
import { authenticate } from './middleware/auth'

// Load environment variables
config()

export const build = async () => {
  const fastify = Fastify({
    logger: false, // Disable logging in tests
    trustProxy: true,
  })

  // Register plugins
  await fastify.register(cors, {
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true,
  })

  await fastify.register(helmet)

  await fastify.register(jwt, {
    secret: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production',
  })

  // Add authenticate middleware to fastify instance
  fastify.decorate('authenticate', authenticate)

  // Register routes
  await registerRoutes(fastify)

  // Error handler
  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error)
    
    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
        details: error.validation,
      })
    }

    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    })
  })

  return fastify
}

const fastify = Fastify({
  logger: true,
  trustProxy: true,
})

// Register plugins
const registerPlugins = async (): Promise<void> => {
  await fastify.register(cors, {
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true,
  })

  await fastify.register(helmet)

  await fastify.register(jwt, {
    secret: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production',
  })

  // Add authenticate middleware to fastify instance
  fastify.decorate('authenticate', authenticate)
}

// Error handler
fastify.setErrorHandler((error, _request, reply) => {
  fastify.log.error(error)
  
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    })
  }

  return reply.status(500).send({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  })
})

// Start server
const start = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase()
    
    // Register plugins and routes
    await registerPlugins()
    await registerRoutes(fastify)

    const port = parseInt(process.env['PORT'] || '3001', 10)
    const host = process.env['HOST'] || '0.0.0.0'

    await fastify.listen({ port, host })
    
    console.log(`🚀 Server is running on http://${host}:${port}`)
    console.log(`📊 Health check: http://${host}:${port}/health`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...')
  await fastify.close()
  await disconnectDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...')
  await fastify.close()
  await disconnectDatabase()
  process.exit(0)
})

// Only start server if this file is run directly
if (require.main === module) {
  start()
} 