import 'dotenv/config'
import { config } from 'dotenv'
import path from 'path'

// Load .env.local if it exists
config({ path: path.join(__dirname, '../.env.local') })
import Fastify from 'fastify'
import cors from '@fastify/cors'
import session from '@fastify/secure-session'
import staticFiles from '@fastify/static'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { connectDatabase } from './config/database'
import { registerRoutes } from './routes/index'
import { User } from './models/User'

export const build = async () => {
  const fastify = Fastify({
    logger: {
      level: process.env['LOG_LEVEL'] || 'info',
    },
    bodyLimit: 10485760, // 10MB
  })

  // Register plugins
  await fastify.register(cors, {
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
  })

  await fastify.register(session, {
    secret: process.env['SESSION_SECRET'] || 'your-secret-key',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
    },
  } as any)

  // Serve static files from uploads directory
  await fastify.register(staticFiles, {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/',
  })

  // Initialize Passport
  fastify.addHook('preHandler', (request, _reply, next) => {
    request.session = request.session || {}
    next()
  })

  // Add raw body for webhooks
  fastify.addHook('preHandler', async (request, _reply) => {
    if (request.url === '/api/stripe/webhook') {
      // For now, we'll handle webhook verification differently
      ;(request as any).isWebhook = true
    }
  })

  // Configure content type parser for logout endpoint
  fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    if (req.url === '/api/auth/logout') {
      // For logout endpoint, don't parse the body
      done(null, undefined)
    } else {
      // For other endpoints, parse as JSON
      try {
        const json = JSON.parse(body as string)
        done(null, json)
      } catch (err) {
        done(err as Error)
      }
    }
  })

  // Configure Passport Local Strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username })
          if (!user) {
            return done(null, false, { message: 'Invalid username or password' })
          }

          if (!user.isActive) {
            return done(null, false, { message: 'Account is deactivated' })
          }

          const isValidPassword = await user.comparePassword(password)
          if (!isValidPassword) {
            return done(null, false, { message: 'Invalid username or password' })
          }

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.serializeUser((user: any, done) => {
    done(null, user._id.toString())
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      done(error)
    }
  })

  // Authentication middleware
  fastify.decorate('authenticate', async (request: any, reply: any) => {
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
  })

  // Register all routes with API prefix
  await fastify.register(registerRoutes, { prefix: '/api' })

  // Connect to database only if not in test environment
  if (process.env['NODE_ENV'] !== 'test') {
    await connectDatabase()
  }

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