import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';

interface UserRequest extends FastifyRequest {
  user?: IUser;
}

export const registerUserRoutes = (fastify: FastifyInstance): void => {
  // List all users (admin only)
  fastify.get('/', { preHandler: authenticate }, async (request: UserRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const { search = '', role, isActive, page = 1, limit = 20 } = request.query as any;
      const filter: any = {};
      
      if (role) filter.role = role;
      if (isActive !== undefined) filter.isActive = isActive === 'true' || isActive === true;
      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter)
      ]);

      return {
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching users', error: (error as Error).message });
    }
  });

  // Update user (admin only)
  fastify.put('/:id', { preHandler: authenticate }, async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const user = request.user as IUser;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const { id } = request.params as { id: string };
      const updateData = request.body as any;
      
      // Prevent updating password directly here
      delete updateData.password;
      
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
      if (!updatedUser) {
        return reply.status(404).send({ success: false, message: 'User not found' });
      }

      return { success: true, data: { user: updatedUser } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error updating user', error: (error as Error).message });
    }
  });

  // Delete user (admin only)
  fastify.delete('/:id', { 
    preHandler: authenticate,
    schema: {
      body: false // Disable body parsing for DELETE requests
    }
  }, async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const user = request.user as IUser;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const { id } = request.params as { id: string };
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return reply.status(404).send({ success: false, message: 'User not found' });
      }

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error deleting user', error: (error as Error).message });
    }
  });
}; 