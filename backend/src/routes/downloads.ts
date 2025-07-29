import { FastifyInstance } from 'fastify'
import { Download } from '../models/Download'
import { Template } from '../models/Template'
import { License } from '../models/License'

interface DownloadTemplateBody {
  templateId: string
  licenseId: string
}

export const registerDownloadRoutes = (fastify: FastifyInstance): void => {
  // Download a template (authenticated users only)
  fastify.post<{ Body: DownloadTemplateBody }>(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['templateId', 'licenseId'],
          properties: {
            templateId: { type: 'string' },
            licenseId: { type: 'string' },
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

        const { templateId, licenseId } = request.body

        // Verify template exists and is active
        const template = await Template.findById(templateId)
        if (!template || template.status !== 'active') {
          return reply.status(404).send({ success: false, message: 'Template not found or inactive' })
        }

        // Verify license exists and is active
        const license = await License.findById(licenseId)
        if (!license || !license.isActive) {
          return reply.status(404).send({ success: false, message: 'License not found or inactive' })
        }

        // Check if user has purchased this template (has download record)
        let downloadRecord = await Download.findOne({
          userId: sessionUser.id,
          templateId,
          licenseId,
        })

        if (!downloadRecord) {
          return reply.status(403).send({ 
            success: false, 
            message: 'You must purchase this template before downloading it.' 
          })
        }

        // Check if user has reached the download limit
        if (license.maxDownloads !== -1 && downloadRecord.downloadCount >= license.maxDownloads) {
          return reply.status(403).send({ 
            success: false, 
            message: `Download limit reached. You can download this template ${license.maxDownloads} times with the ${license.name} license.` 
          })
        }

        // Increment download count
        downloadRecord.downloadCount += 1
        downloadRecord.lastDownloadAt = new Date()
        await downloadRecord.save()

        // Increment template download count
        await Template.findByIdAndUpdate(templateId, {
          $inc: { downloads: 1 }
        })

        reply.send({
          success: true,
          message: 'Template downloaded successfully',
          data: {
            downloadCount: downloadRecord.downloadCount,
            maxDownloads: license.maxDownloads,
            remainingDownloads: license.maxDownloads === -1 ? -1 : license.maxDownloads - downloadRecord.downloadCount,
            downloadUrl: template.fileUrl, // This would be the actual file URL
          },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get user's download history
  fastify.get(
    '/history',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' })
        }

        const downloads = await Download.find({ userId: sessionUser.id })
          .populate('templateId', 'title description')
          .populate('licenseId', 'name maxDownloads')
          .sort({ lastDownloadAt: -1 })

        reply.send({
          success: true,
          data: { downloads },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )

  // Get download status for a specific template
  fastify.get<{ Querystring: { templateId: string; licenseId: string } }>(
    '/status',
    {
      preHandler: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['templateId', 'licenseId'],
          properties: {
            templateId: { type: 'string' },
            licenseId: { type: 'string' },
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

        const { templateId, licenseId } = request.query

        const downloadRecord = await Download.findOne({
          userId: sessionUser.id,
          templateId,
          licenseId,
        })

        const license = await License.findById(licenseId)

        if (!license) {
          return reply.status(404).send({ success: false, message: 'License not found' })
        }

        const downloadCount = downloadRecord?.downloadCount || 0
        const maxDownloads = license.maxDownloads
        const remainingDownloads = maxDownloads === -1 ? -1 : maxDownloads - downloadCount
        const canDownload = maxDownloads === -1 || downloadCount < maxDownloads

        reply.send({
          success: true,
          data: {
            downloadCount,
            maxDownloads,
            remainingDownloads,
            canDownload,
            licenseName: license.name,
          },
        })
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ success: false, message: 'Internal Server Error' })
      }
    }
  )
} 