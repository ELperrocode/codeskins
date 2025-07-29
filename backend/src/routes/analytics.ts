import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Template } from '../models/Template';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';

interface AnalyticsRequest extends FastifyRequest {
  user?: IUser;
}

export const registerAnalyticsRoutes = (fastify: FastifyInstance): void => {
  // Get overall analytics (admin only)
  fastify.get('/overview', { preHandler: authenticate }, async (request: AnalyticsRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const [
        totalSales,
        totalOrders,
        totalUsers,
        totalTemplates,
        recentOrders,
        topTemplates,
        monthlySales
      ] = await Promise.all([
        // Total sales
        Order.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ]),
        
        // Total orders
        Order.countDocuments(),
        
        // Total users
        User.countDocuments(),
        
        // Total templates
        Template.countDocuments(),
        
        // Recent orders
        Order.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('customerId', 'username email')
          .populate('items.templateId', 'title'),
        
        // Top selling templates
        Template.find({ isActive: true })
          .sort({ sales: -1 })
          .limit(5)
          .select('title sales price category'),
        
        // Monthly sales for current year
        Order.aggregate([
          { $match: { status: 'completed' } },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              total: { $sum: '$total' },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
          { $limit: 12 }
        ])
      ]);

      return {
        success: true,
        data: {
          totalSales: totalSales[0]?.total || 0,
          totalOrders,
          totalUsers,
          totalTemplates,
          recentOrders,
          topTemplates,
          monthlySales
        }
      };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching analytics', error: (error as Error).message });
    }
  });

  // Get customer analytics
  fastify.get('/customer', { preHandler: authenticate }, async (request: AnalyticsRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user) {
        return reply.status(401).send({ success: false, message: 'Authentication required' });
      }

      const [
        totalSpent,
        totalOrders,
        recentOrders,
        favoriteCategories
      ] = await Promise.all([
        // Total spent
        Order.aggregate([
          { $match: { customerId: user._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ]),
        
        // Total orders
        Order.countDocuments({ customerId: user._id }),
        
        // Recent orders
        Order.find({ customerId: user._id })
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('items.templateId', 'title category price'),
        
        // Favorite categories
        Order.aggregate([
          { $match: { customerId: user._id } },
          { $unwind: '$items' },
          {
            $lookup: {
              from: 'templates',
              localField: 'items.templateId',
              foreignField: '_id',
              as: 'templateDetails'
            }
          },
          { $unwind: '$templateDetails' },
          {
            $group: {
              _id: '$templateDetails.category',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ])
      ]);

      return {
        success: true,
        data: {
          totalSpent: totalSpent[0]?.total || 0,
          totalOrders,
          recentOrders,
          favoriteCategories
        }
      };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching customer analytics', error: (error as Error).message });
    }
  });
}; 