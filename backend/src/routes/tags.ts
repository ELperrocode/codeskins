import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Tag } from '../models/Tag';
import { Template } from '../models/Template';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';

interface CreateTagBody {
  name: string;
  description?: string;
  color?: string;
}

interface UpdateTagBody {
  name?: string;
  description?: string;
  isActive?: boolean;
  color?: string;
  slug?: string;
}

interface TagRequest extends FastifyRequest {
  user?: IUser;
}

export const registerTagRoutes = (fastify: FastifyInstance): void => {
  // Get all tags (public)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { active = 'true' } = request.query as { active?: string };
      const filter: any = {};
      
      if (active === 'true') {
        filter.isActive = true;
      }

      const tags = await Tag.find(filter)
        .sort({ templateCount: -1, name: 1 });

      return { success: true, data: { tags } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching tags', error: (error as Error).message });
    }
  });

  // Get tag by ID (public)
  fastify.get('/:id', async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const tag = await Tag.findById(id);
      
      if (!tag) {
        return reply.status(404).send({ success: false, message: 'Tag not found' });
      }

      return { success: true, data: { tag } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching tag', error: (error as Error).message });
    }
  });

  // Create tag (admin only)
  fastify.post('/', { preHandler: authenticate }, async (request: TagRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const { name, description, color = '#3B82F6' } = request.body as CreateTagBody;
      
      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Check if tag already exists
      const existingTag = await Tag.findOne({ $or: [{ name }, { slug }] });
      if (existingTag) {
        return reply.status(409).send({ success: false, message: 'Tag with this name or slug already exists' });
      }

      const tag = new Tag({
        name,
        description,
        slug,
        color,
        templateCount: 0
      });

      await tag.save();

      return { success: true, data: { tag } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error creating tag', error: (error as Error).message });
    }
  });

  // Update tag (admin only)
  fastify.put('/:id', { preHandler: authenticate }, async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const user = request.user as IUser;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const { id } = request.params as { id: string };
      const updateData = request.body as UpdateTagBody;

      const tag = await Tag.findById(id);
      if (!tag) {
        return reply.status(404).send({ success: false, message: 'Tag not found' });
      }

      // If name is being updated, check for conflicts and update slug
      if (updateData.name && updateData.name !== tag.name) {
        const newSlug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingTag = await Tag.findOne({ 
          $or: [{ name: updateData.name }, { slug: newSlug }],
          _id: { $ne: id }
        });
        
        if (existingTag) {
          return reply.status(409).send({ success: false, message: 'Tag with this name or slug already exists' });
        }
        
        updateData.slug = newSlug;
      }

      const updatedTag = await Tag.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      return { success: true, data: { tag: updatedTag } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error updating tag', error: (error as Error).message });
    }
  });

  // Delete tag (admin only)
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

      // Check if tag exists
      const tag = await Tag.findById(id);
      if (!tag) {
        return reply.status(404).send({ success: false, message: 'Tag not found' });
      }

      // Check if tag has templates
      const templateCount = await Template.countDocuments({ tags: tag.name });
      if (templateCount > 0) {
        return reply.status(400).send({ 
          success: false, 
          message: `Cannot delete tag. It has ${templateCount} templates associated with it.` 
        });
      }

      await Tag.findByIdAndDelete(id);

      return { success: true, message: 'Tag deleted successfully' };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error deleting tag', error: (error as Error).message });
    }
  });

  // Get tag statistics (admin only)
  fastify.get('/stats/overview', { preHandler: authenticate }, async (request: TagRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const [totalTags, activeTags, topTags] = await Promise.all([
        Tag.countDocuments(),
        Tag.countDocuments({ isActive: true }),
        Tag.find({ isActive: true })
          .sort({ templateCount: -1 })
          .limit(10)
          .select('name templateCount color')
      ]);

      return {
        success: true,
        stats: {
          totalTags,
          activeTags,
          topTags
        }
      };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching tag stats', error: (error as Error).message });
    }
  });
}; 