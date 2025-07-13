import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import secureSession from '@fastify/secure-session'
import fastifyPassport from '@fastify/passport'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
import { connectDatabase, disconnectDatabase } from './config/database'
import { registerRoutes } from './routes'
import { authenticate } from './middleware/auth'
import './config/passport' // Import passport configuration

// Load environment variables
config()

// Define a key for the session
const sessionKeyPath = path.join(__dirname, 'session-key.txt')
let sessionKey: Buffer

if (process.env['SESSION_KEY']) {
  sessionKey = Buffer.from(process.env['SESSION_KEY'], 'hex')
} else if (fs.existsSync(sessionKeyPath)) {
  sessionKey = Buffer.from(fs.readFileSync(sessionKeyPath, 'utf8'), 'hex')
} else {
  sessionKey = require('crypto').randomBytes(32)
  fs.writeFileSync(sessionKeyPath, sessionKey.toString('hex'))
}


export const build = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: process.env['NODE_ENV'] !== 'test',
    trustProxy: true,
  })

  // Register plugins
  await fastify.register(cors, {
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true,
  })

  await fastify.register(helmet)

  await fastify.register(secureSession, {
    key: sessionKey,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })

  // Initialize Passport
  await fastify.register(fastifyPassport.initialize())
  await fastify.register(fastifyPassport.secureSession())

  // Add authenticate middleware to fastify instance
  fastify.decorate('authenticate', authenticate)

  // Register routes
  await registerRoutes(fastify)

  // Connect to database
  await connectDatabase()

  // Disconnect from database on close
  fastify.addHook('onClose', async () => {
    await disconnectDatabase()
  })

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

const start = async (): Promise<void> => {
  try {
    const server = await build()

    // Connect to database
    // await connectDatabase() // This is now handled in build()

    const port = parseInt(process.env['PORT'] || '3001', 10)
    const host = process.env['HOST'] || '0.0.0.0'

    await server.listen({ port, host })

    // Handle graceful shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`🛑 Shutting down server on ${signal}...`)
        await server.close()
        // await disconnectDatabase() // This is now handled by the onClose hook
        process.exit(0)
      })
    }
  } catch (err) {
    console.error('💥 Error starting server:', err)
    process.exit(1)
  }
}

// Only start server if this file is run directly
if (require.main === module) {
  start()
} 