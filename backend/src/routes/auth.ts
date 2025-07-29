import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import * as passport from 'passport'
import { User, IUser } from '../models/User'

interface LoginBody {
  username: string
  password: string
}

interface RegisterBody extends LoginBody {
  email: string
  role?: 'customer';
}

// Extend the session interface to include user data
declare module '@fastify/secure-session' {
  interface SessionData {
    user?: {
      id: string
      role: string
    }
  }
}

export const registerAuthRoutes = (fastify: FastifyInstance): void => {
  // Register user
  fastify.post<{ Body: RegisterBody }>(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', minLength: 3 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['customer'], default: 'customer' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { username, email, password, role = 'customer' } = request.body

        const existingUser: IUser | null = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
          return reply.status(409).send({
            success: false,
            message: 'User already exists with this email or username',
          })
        }

        const user: IUser = new User({
          username,
          email,
          password, // plain password, hashing is handled by the model
          role,
          isActive: true,
          firstName: username, // Use username as firstName if not provided
          lastName: '', // Empty string as default
        })
        await user.save()

        // Store user in session manually since we can't use request.login directly
        request.session.user = {
          id: (user as any)._id.toString(),
          role: user.role,
        }

        reply.status(201).send({
          success: true,
          message: 'User registered successfully',
          data: {
            user: {
              id: (user as any)._id.toString(),
              username: user.username,
              email: user.email,
              role: user.role,
            },
          },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Login user
  fastify.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      },
    },
    (request: FastifyRequest, reply: FastifyReply) => {
      return passport.authenticate('local', (err: Error | null, user: IUser | false, info: { message: string }) => {
        if (err) {
          fastify.log.error('Passport authentication error:', err)
          return reply.status(500).send({ success: false, message: 'Internal Server Error' })
        }
        if (!user) {
          const status = info.message === 'Account is deactivated' ? 403 : 401
          return reply.status(status).send({ success: false, message: info.message || 'Authentication failed' })
        }

        // Store user in session
        request.session.user = {
          id: (user as any)._id.toString(),
          role: user.role,
        }

        return reply.send({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: (user as any)._id.toString(),
              username: user.username,
              email: user.email,
              role: user.role,
            },
          },
        })
      })(request, reply)
    }
  )

  // Logout user
  fastify.post('/logout', {
    schema: {
      body: false, // No body required for logout
    },
  }, (request, reply) => {
    // Clear session data
    delete request.session.user
    // Clear the session cookie
    reply.clearCookie('session', {
      path: '/',
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
    })
    reply.send({
      success: true,
      message: 'Logout successful',
    })
  })

  // Get current user profile
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      // Get user from session
      const sessionUser = request.session.user
      if (!sessionUser) {
        return reply.status(404).send({ success: false, message: 'User not found in session' })
      }

      // Fetch fresh user data from database
      const user = await User.findById(sessionUser.id).select('-password')
      if (!user) {
        return reply.status(404).send({ success: false, message: 'User not found' })
      }

      reply.send({
        success: true,
        data: {
                      user: {
              id: (user as any)._id.toString(),
              username: user.username,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
        },
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, message: 'Internal Server Error' })
    }
  })
} 