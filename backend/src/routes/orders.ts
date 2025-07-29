import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Order, IOrder } from '../models/Order'
import { User } from '../models/User'
import { Template } from '../models/Template'

interface CreateOrderBody {
  templateId: string
  amount: number
  currency?: string
  stripePaymentId: string
  stripeSessionId?: string
  paymentMethod: string
}

interface UpdateOrderBody {
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  stripeSessionId?: string
}

export const registerOrderRoutes = (fastify: FastifyInstance): void => {
  // Create a new order
  fastify.post<{ Body: CreateOrderBody }>(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['templateId', 'amount', 'stripePaymentId', 'paymentMethod'],
          properties: {
            templateId: { type: 'string' },
            amount: { type: 'number', minimum: 0 },
            currency: { type: 'string', default: 'usd' },
            stripePaymentId: { type: 'string' },
            stripeSessionId: { type: 'string' },
            paymentMethod: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({
            success: false,
            message: 'Unauthorized',
          })
        }

        const { templateId, amount, currency = 'usd', stripePaymentId, stripeSessionId, paymentMethod } = request.body

        // Verify template exists and get owner info
        const template = await Template.findById(templateId)
        if (!template) {
          return reply.status(404).send({
            success: false,
            message: 'Template not found',
          })
        }

        // Get customer info
        const customer = await User.findById(sessionUser.id)
        if (!customer) {
          return reply.status(404).send({
            success: false,
            message: 'Customer not found',
          })
        }

        // Check if order already exists with this stripePaymentId
        const existingOrder = await Order.findOne({ stripePaymentId })
        if (existingOrder) {
          return reply.status(409).send({
            success: false,
            message: 'Order with this payment ID already exists',
          })
        }

        const order = new Order({
          customerId: sessionUser.id,
          templateId,
          ownerId: template.ownerId,
          amount,
          currency: currency.toUpperCase(),
          stripePaymentId,
          stripeSessionId,
          status: 'pending',
          paymentMethod,
          customerEmail: customer.email,
          templateTitle: template.title,
        })

        await order.save()

        reply.status(201).send({
          success: true,
          message: 'Order created successfully',
          data: { order },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get all orders (with filters)
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            customerId: { type: 'string' },
            ownerId: { type: 'string' },
            templateId: { type: 'string' },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
            page: { type: 'number', minimum: 1, default: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({
            success: false,
            message: 'Unauthorized',
          })
        }

        const { status, customerId, ownerId, templateId, limit = 20, page = 1 } = request.query as any

        // Build filter based on user role
        const filter: any = {}
        
        if (sessionUser.role === 'customer') {
          filter.customerId = sessionUser.id
        } else if (sessionUser.role === 'admin') {
          // No seller role, only admin or customer
        }

        if (status) filter.status = status
        if (customerId) filter.customerId = customerId
        if (ownerId) filter.ownerId = ownerId
        if (templateId) filter.templateId = templateId

        const skip = (page - 1) * limit

        const orders = await Order.find(filter)
          .populate('customerId', 'username email')
          .populate('ownerId', 'username email')
          .populate('items.templateId', 'title price')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)

        const total = await Order.countDocuments(filter)

        reply.send({
          success: true,
          data: {
            orders,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get order by ID
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({
            success: false,
            message: 'Unauthorized',
          })
        }

        const { id } = request.params

        const order = await Order.findById(id)
          .populate('customerId', 'username email')
          .populate('ownerId', 'username email')
          .populate('items.templateId', 'title price description')

        if (!order) {
          return reply.status(404).send({
            success: false,
            message: 'Order not found',
          })
        }

        // Check permissions
        if (sessionUser.role === 'customer' && order.customerId.toString() !== sessionUser.id) {
          return reply.status(403).send({
            success: false,
            message: 'Access denied',
          })
        }

        // No seller role, only admin or customer

        reply.send({
          success: true,
          data: { order },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Update order status
  fastify.patch<{ Params: { id: string }; Body: UpdateOrderBody }>(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            stripeSessionId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({
            success: false,
            message: 'Unauthorized',
          })
        }

        const { id } = request.params
        const { status, stripeSessionId } = request.body

        const order = await Order.findById(id)

        if (!order) {
          return reply.status(404).send({
            success: false,
            message: 'Order not found',
          })
        }

        // Check permissions - only admin, seller, or the customer can update
        if (sessionUser.role === 'customer' && order.customerId.toString() !== sessionUser.id) {
          return reply.status(403).send({
            success: false,
            message: 'Access denied',
          })
        }

        // No seller role, only admin or customer

        // Update fields
        if (status) order.status = status
        if (stripeSessionId) order.stripeSessionId = stripeSessionId

        await order.save()

        reply.send({
          success: true,
          message: 'Order updated successfully',
          data: { order },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Delete order (admin only)
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({
            success: false,
            message: 'Unauthorized',
          })
        }

        // Only admin can delete orders
        if (sessionUser.role !== 'admin') {
          return reply.status(403).send({
            success: false,
            message: 'Access denied. Admin only.',
          })
        }

        const { id } = request.params

        const order = await Order.findByIdAndDelete(id)

        if (!order) {
          return reply.status(404).send({
            success: false,
            message: 'Order not found',
          })
        }

        reply.send({
          success: true,
          message: 'Order deleted successfully',
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get order statistics
  fastify.get(
    '/stats/summary',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({
            success: false,
            message: 'Unauthorized',
          })
        }

        // Build filter based on user role
        const filter: any = {}
        
        if (sessionUser.role === 'customer') {
          filter.customerId = sessionUser.id
        } else if (sessionUser.role === 'admin') {
          // No seller role, only admin or customer
        }

        const stats = await Order.aggregate([
          { $match: filter },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$amount' },
              pendingOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
              },
              completedOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
              },
              failedOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
              },
              refundedOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] },
              },
            },
          },
        ])

        const result = stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          completedOrders: 0,
          failedOrders: 0,
          refundedOrders: 0,
        }

        reply.send({
          success: true,
          data: result,
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get order by Stripe session ID
  fastify.get(
    '/session/:sessionId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({
            success: false,
            message: 'Unauthorized',
          })
        }

        const { sessionId } = request.params as { sessionId: string }

        const order = await Order.findOne({ 
          stripeSessionId: sessionId,
          customerId: sessionUser.id 
        }).populate('items.templateId', 'title description price category')

        if (!order) {
          return reply.status(404).send({
            success: false,
            message: 'Order not found',
          })
        }

        // Format order for frontend
        const formattedOrder = {
          orderId: order._id,
          total: order.total,
          currency: order.currency,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items || []
        }

        reply.send({
          success: true,
          data: { order: formattedOrder },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )
} 