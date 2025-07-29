import { FastifyInstance } from 'fastify'
import { License } from '../models/License'

interface CreateLicenseBody {
  name: string
  description: string
  price: number
  maxSales?: number
}

interface UpdateLicenseBody {
  name?: string
  description?: string
  price?: number
  maxSales?: number
  isActive?: boolean
}

export const registerLicenseRoutes = (fastify: FastifyInstance): void => {
  // Get all active license types (public)
  fastify.get(
    '/',
    async (_request, reply) => {
      try {
        const licenses = await License.find({ isActive: true })
          .sort({ name: 1 })

        reply.send({
          success: true,
          data: { licenses },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get single license type (public)
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
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
        const { id } = request.params

        const license = await License.findById(id)

        if (!license || !license.isActive) {
          return reply.status(404).send({ success: false, message: 'License not found' })
        }

        reply.send({
          success: true,
          data: { license },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Create license type (admin only)
  fastify.post<{ Body: CreateLicenseBody }>(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'description', 'price'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            description: { type: 'string', minLength: 10, maxLength: 200 },
            price: { type: 'number', minimum: 0 },
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

        // Only admins can create license types
        if (sessionUser.role !== 'admin') {
          return reply.status(403).send({ success: false, message: 'Only admins can create license types' })
        }

        const { name, description, price, maxSales } = request.body

        // Check if license name already exists
        const existingLicense = await License.findOne({ name })
        if (existingLicense) {
          return reply.status(409).send({ success: false, message: 'License type with this name already exists' })
        }

        const license = new License({
          name,
          description,
          price,
          maxSales: maxSales || -1, // Default to unlimited if not specified
        })

        await license.save()

        reply.status(201).send({
          success: true,
          message: 'License type created successfully',
          data: { license },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Update license type (admin only)
  fastify.put<{ Params: { id: string }; Body: UpdateLicenseBody }>(
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
            name: { type: 'string', minLength: 2, maxLength: 50 },
            description: { type: 'string', minLength: 10, maxLength: 200 },
            price: { type: 'number', minimum: 0 },
            isActive: { type: 'boolean' },
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

        // Only admins can update license types
        if (sessionUser.role !== 'admin') {
          return reply.status(403).send({ success: false, message: 'Only admins can update license types' })
        }

        const { id } = request.params
        const updateData = request.body

        const license = await License.findById(id)
        if (!license) {
          return reply.status(404).send({ success: false, message: 'License not found' })
        }

        // Check if name is being changed and if it already exists
        if (updateData.name && updateData.name !== license.name) {
          const existingLicense = await License.findOne({ name: updateData.name })
          if (existingLicense) {
            return reply.status(409).send({ success: false, message: 'License type with this name already exists' })
          }
        }

        const updatedLicense = await License.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        )

        reply.send({
          success: true,
          message: 'License type updated successfully',
          data: { license: updatedLicense },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Delete license type (admin only)
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

        // Only admins can delete license types
        if (sessionUser.role !== 'admin') {
          return reply.status(403).send({ success: false, message: 'Only admins can delete license types' })
        }

        const { id } = request.params

        const license = await License.findById(id)
        if (!license) {
          return reply.status(404).send({ success: false, message: 'License not found' })
        }

        // TODO: Check if any templates are using this license type
        // For now, we'll just delete it
        await License.findByIdAndDelete(id)

        reply.send({
          success: true,
          message: 'License type deleted successfully',
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )
} 