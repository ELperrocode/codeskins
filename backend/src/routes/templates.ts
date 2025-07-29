import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { Template } from '../models/Template';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';
import { pipeline } from 'stream/promises';
import fastifyMultipart from '@fastify/multipart';

interface CreateTemplateBody {
  title: string;
  description: string;
  licenseId: string;
  price: number;
  maxDownloads: number;
  category: string;
  tags?: string[];
  fileUrl?: string;
  previewImages?: string[];
  features?: string[];
  status?: 'active' | 'inactive' | 'draft';
}



interface TemplateQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  status?: string;
  tags?: string;
}

interface TemplateRequest extends FastifyRequest {
  user?: IUser;
}

// Define a RouteGeneric type for params


export const registerTemplateRoutes = (fastify: FastifyInstance): void => {
  // Register multipart plugin if not already
  if (!fastify.hasDecorator('multipart')) {
    fastify.register(fastifyMultipart as any);
  }

  // Get all templates with filtering and pagination
  fastify.get('/', async (request: FastifyRequest<{ Querystring: TemplateQuery }>, reply: FastifyReply) => {
    try {
      const { 
        category, 
        minPrice, 
        maxPrice, 
        search, 
        sort = 'createdAt', 
        page = 1, 
        limit = 12,
        status = 'active',
        tags 
      } = request.query;

      // Build filter object
      const filter: any = { isActive: true };
      
      if (status && status !== 'all') {
        filter.status = status;
      }
      
      if (category) {
        filter.category = category;
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = minPrice;
        if (maxPrice !== undefined) filter.price.$lte = maxPrice;
      }

      if (tags) {
        filter.tags = { $in: tags.split(',') };
      }

      // Build search query
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Build sort object
      let sortObj: any = {};
      switch (sort) {
        case 'price-asc':
          sortObj.price = 1;
          break;
        case 'price-desc':
          sortObj.price = -1;
          break;
        case 'rating':
          sortObj.rating = -1;
          break;
        case 'sales':
          sortObj.sales = -1;
          break;
        case 'newest':
          sortObj.createdAt = -1;
          break;
        default:
          sortObj.createdAt = -1;
      }

      const skip = (page - 1) * limit;

      const [templates, total] = await Promise.all([
        Template.find(filter)
          .populate('ownerId', 'username firstName lastName')
          .populate('licenseId', 'name description')
          .sort(sortObj)
          .skip(skip)
          .limit(limit),
        Template.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          templates,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching templates', error: (error as Error).message });
    }
  });

  // Get template by ID
  fastify.get('/:id', async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const template = await Template.findById(id)
        .populate('ownerId', 'username firstName lastName')
        .populate('licenseId', 'name description price maxDownloads');

      if (!template) {
        return reply.status(404).send({ success: false, message: 'Template not found' });
      }

      // Increment downloads count
      template.downloads += 1;
      await template.save();

      return { success: true, data: { template } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching template', error: (error as Error).message });
    }
  });

  // Create new template (admin only)
  fastify.post('/', { preHandler: authenticate }, async (request: TemplateRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Only admins can create templates' });
      }

      const templateData = request.body as CreateTemplateBody;

      const template = new Template({
        ...templateData,
        ownerId: user._id,
        isActive: true,
        downloads: 0,
        sales: 0,
        rating: 0,
        reviewCount: 0,
        status: templateData.status || 'draft'
      });

      await template.save();
      await template.populate('ownerId', 'username firstName lastName');
      await template.populate('licenseId', 'name description');

      return { success: true, data: { template } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error creating template', error: (error as Error).message });
    }
  });

  // Update template (admin/owner only)
  fastify.put('/:id', { preHandler: authenticate }, async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const user = request.user as IUser & { _id: string };
      if (!user) {
        return reply.status(401).send({ success: false, message: 'Authentication required' });
      }

      const { id } = request.params as { id: string };
      const template = await Template.findById(id);
      if (!template) {
        return reply.status(404).send({ success: false, message: 'Template not found' });
      }

      // Check if user owns the template or is admin
      if (template.ownerId.toString() !== user._id.toString() && user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Not authorized to update this template' });
      }

      const updateData = request.body as any;
      Object.assign(template, updateData);

      await template.save();
      await template.populate('ownerId', 'username firstName lastName');
      await template.populate('licenseId', 'name description');

      return { success: true, data: { template } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error updating template', error: (error as Error).message });
    }
  });

  // Delete template (admin/owner only)
  fastify.delete('/:id', { 
    preHandler: authenticate,
    schema: {
      body: false // Disable body parsing for DELETE requests
    }
  }, async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const user = request.user as IUser & { _id: string };
      if (!user) {
        return reply.status(401).send({ success: false, message: 'Authentication required' });
      }

      const { id } = request.params as { id: string };
      const template = await Template.findById(id);
      if (!template) {
        return reply.status(404).send({ success: false, message: 'Template not found' });
      }

      // Check if user owns the template or is admin
      if (template.ownerId.toString() !== user._id.toString() && user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Not authorized to delete this template' });
      }

      await Template.findByIdAndDelete(id);

      return { success: true, message: 'Template deleted successfully' };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error deleting template', error: (error as Error).message });
    }
  });

  // Get categories
  fastify.get('/categories', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await Template.distinct('category', { isActive: true });
      return { success: true, data: { categories } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching categories', error: (error as Error).message });
    }
  });

  // Get tags
  fastify.get('/tags', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tags = await Template.distinct('tags', { isActive: true });
      const flatTags = tags.flat().filter((tag, index, arr) => arr.indexOf(tag) === index);
      return { success: true, data: { tags: flatTags } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching tags', error: (error as Error).message });
    }
  });

  // Upload template preview image (admin only)
  fastify.post('/upload-image', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    const user = request.user;
    if (!user || user.role !== 'admin') {
      return reply.status(403).send({ success: false, message: 'Only admins can upload images' });
    }
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ success: false, message: 'No file uploaded' });
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({ success: false, message: 'Invalid file type' });
    }
    const uploadsDir = path.join(__dirname, '../../uploads/templates');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const fileName = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const filePath = path.join(uploadsDir, fileName);
    const writeStream = fs.createWriteStream(filePath);
    await pipeline(data.file, writeStream);
    // URL pública (ajustar según config de backend)
    const publicUrl = `/uploads/templates/${fileName}`;
    return reply.send({ success: true, data: { url: publicUrl } });
  });

  // Download template file (authenticated users who have purchased the template)
  fastify.get('/:id/download', { preHandler: authenticate }, async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const user = request.user as IUser & { _id: string };
      if (!user) {
        return reply.status(401).send({ success: false, message: 'Authentication required' });
      }

      const { id } = request.params as { id: string };
      
      // Find the template
      const template = await Template.findById(id);
      if (!template) {
        return reply.status(404).send({ success: false, message: 'Template not found' });
      }

      // Check if user has purchased this template
      const { Order } = require('../models/Order');
      const order = await Order.findOne({
        customerId: user._id,
        'items.templateId': template._id,
        status: 'completed'
      });

      if (!order && user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'You must purchase this template before downloading' });
      }

      // Check if template has a file URL
      if (!template.fileUrl) {
        return reply.status(404).send({ success: false, message: 'Template file not available' });
      }

      // Construct file path
      const filePath = path.join(__dirname, '../../uploads/downloads', template.fileUrl);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return reply.status(404).send({ success: false, message: 'Template file not found on server' });
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;
      const fileName = path.basename(template.fileUrl);

      // Set headers for file download
      reply.header('Content-Type', 'application/octet-stream');
      reply.header('Content-Disposition', `attachment; filename="${fileName}"`);
      reply.header('Content-Length', fileSize);
      reply.header('Cache-Control', 'no-cache');

      // Create read stream and pipe to response
      const fileStream = fs.createReadStream(filePath);
      reply.send(fileStream);

      // Increment download count
      template.downloads += 1;
      await template.save();

    } catch (error) {
      console.error('Download error:', error);
      reply.status(500).send({ success: false, message: 'Error downloading template', error: (error as Error).message });
    }
  });
}; 