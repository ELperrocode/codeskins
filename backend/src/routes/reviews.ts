import { FastifyInstance } from 'fastify'
import { Review } from '../models/Review'
import { Template } from '../models/Template'
import { Download } from '../models/Download'

interface CreateReviewBody {
  templateId: string
  rating: number
  title: string
  comment: string
}

interface UpdateReviewBody {
  rating?: number
  title?: string
  comment?: string
}

export const registerReviewRoutes = (fastify: FastifyInstance): void => {
  // Get reviews for a template (public)
  fastify.get<{ Querystring: { templateId: string; page?: string; limit?: string } }>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['templateId'],
          properties: {
            templateId: { type: 'string' },
            page: { type: 'string' },
            limit: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { templateId } = request.query
        const page = parseInt(request.query.page || '1')
        const limit = parseInt(request.query.limit || '10')
        const skip = (page - 1) * limit

        const reviews = await Review.find({ 
          templateId, 
          isActive: true 
        })
          .populate('userId', 'username firstName lastName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)

        const total = await Review.countDocuments({ 
          templateId, 
          isActive: true 
        })

        // Calculate average rating
        const avgRating = await Review.aggregate([
          { $match: { templateId, isActive: true } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ])

        const averageRating = avgRating.length > 0 ? avgRating[0].avgRating : 0

        reply.send({
          success: true,
          data: {
            reviews,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
              hasNext: page * limit < total,
              hasPrev: page > 1,
            },
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: total,
          },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get user's review for a template
  fastify.get<{ Querystring: { templateId: string } }>(
    '/my-review',
    {
      preHandler: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['templateId'],
          properties: {
            templateId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' })
        }

        const { templateId } = request.query

        const review = await Review.findOne({
          userId: sessionUser.id,
          templateId,
          isActive: true,
        })

        reply.send({
          success: true,
          data: { review },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Create a review (authenticated users only)
  fastify.post<{ Body: CreateReviewBody }>(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['templateId', 'rating', 'title', 'comment'],
          properties: {
            templateId: { type: 'string' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            title: { type: 'string', minLength: 5, maxLength: 100 },
            comment: { type: 'string', minLength: 10, maxLength: 1000 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' })
        }

        const { templateId, rating, title, comment } = request.body

        // Verify template exists
        const template = await Template.findById(templateId)
        if (!template) {
          return reply.status(404).send({ success: false, message: 'Template not found' })
        }

        // Check if user has already reviewed this template
        const existingReview = await Review.findOne({
          userId: sessionUser.id,
          templateId,
        })

        if (existingReview) {
          return reply.status(409).send({ success: false, message: 'You have already reviewed this template' })
        }

        // Check if user has downloaded/purchased the template (for verification)
        const downloadRecord = await Download.findOne({
          userId: sessionUser.id,
          templateId,
        })

        const isVerified = !!downloadRecord

        const review = new Review({
          userId: sessionUser.id,
          templateId,
          rating,
          title,
          comment,
          isVerified,
        })

        await review.save()

        // Update template rating and review count
        const avgRating = await Review.aggregate([
          { $match: { templateId, isActive: true } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ])

        const newAvgRating = avgRating.length > 0 ? avgRating[0].avgRating : 0
        const reviewCount = await Review.countDocuments({ templateId, isActive: true })

        await Template.findByIdAndUpdate(templateId, {
          rating: Math.round(newAvgRating * 10) / 10,
          reviewCount,
        })

        reply.status(201).send({
          success: true,
          message: 'Review created successfully',
          data: { review },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Update a review (owner only)
  fastify.put<{ Params: { id: string }; Body: UpdateReviewBody }>(
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
            rating: { type: 'number', minimum: 1, maximum: 5 },
            title: { type: 'string', minLength: 5, maxLength: 100 },
            comment: { type: 'string', minLength: 10, maxLength: 1000 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' })
        }

        const { id } = request.params
        const updateData = request.body

        const review = await Review.findById(id)
        if (!review) {
          return reply.status(404).send({ success: false, message: 'Review not found' })
        }

        // Only the review owner can update it
        if (review.userId !== sessionUser.id) {
          return reply.status(403).send({ success: false, message: 'You can only update your own reviews' })
        }

        const updatedReview = await Review.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        )

        // Update template rating
        const avgRating = await Review.aggregate([
          { $match: { templateId: review.templateId, isActive: true } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ])

        const newAvgRating = avgRating.length > 0 ? avgRating[0].avgRating : 0
        const reviewCount = await Review.countDocuments({ templateId: review.templateId, isActive: true })

        await Template.findByIdAndUpdate(review.templateId, {
          rating: Math.round(newAvgRating * 10) / 10,
          reviewCount,
        })

        reply.send({
          success: true,
          message: 'Review updated successfully',
          data: { review: updatedReview },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Delete a review (owner or admin only)
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
          return reply.status(401).send({ success: false, message: 'Unauthorized' })
        }

        const { id } = request.params

        const review = await Review.findById(id)
        if (!review) {
          return reply.status(404).send({ success: false, message: 'Review not found' })
        }

        // Only the review owner or admin can delete it
        if (review.userId !== sessionUser.id && sessionUser.role !== 'admin') {
          return reply.status(403).send({ success: false, message: 'You can only delete your own reviews' })
        }

        await Review.findByIdAndDelete(id)

        // Update template rating
        const avgRating = await Review.aggregate([
          { $match: { templateId: review.templateId, isActive: true } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ])

        const newAvgRating = avgRating.length > 0 ? avgRating[0].avgRating : 0
        const reviewCount = await Review.countDocuments({ templateId: review.templateId, isActive: true })

        await Template.findByIdAndUpdate(review.templateId, {
          rating: Math.round(newAvgRating * 10) / 10,
          reviewCount,
        })

        reply.send({
          success: true,
          message: 'Review deleted successfully',
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )
} 