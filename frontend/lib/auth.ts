import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// @ts-expect-error: bcryptjs has no type declarations
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface RegisterBody {
  email: string;
  password: string;
  role?: 'customer' | 'seller';
}

interface LoginBody {
  email: string;
  password: string;
}

export const registerAuthRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Register user
  fastify.post<{ Body: RegisterBody }>('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['customer', 'seller'], default: 'customer' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
    try {
      const { email, password, role = 'customer' } = request.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return reply.status(400).send({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        role,
        isActive: true
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env['JWT_SECRET'] || 'fallback-secret',
        { expiresIn: '7d' }
      );

      reply.status(201).send({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  // Login user
  fastify.post<{ Body: LoginBody }>('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    try {
      const { email, password } = request.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return reply.status(401).send({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return reply.status(401).send({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return reply.status(401).send({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env['JWT_SECRET'] || 'fallback-secret',
        { expiresIn: '7d' }
      );

      reply.send({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  // Get current user profile
  fastify.get('/api/auth/me', { preHandler: [fastify.authenticate] }, async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (_request.user as any).userId;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'User not found'
        });
      }

      reply.send({
        success: true,
        data: { user }
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  // POST /api/auth/logout
  fastify.post('/api/auth/logout', { preHandler: [fastify.authenticate] }, async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      reply.send({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Internal server error'
      });
    }
  });
}; 