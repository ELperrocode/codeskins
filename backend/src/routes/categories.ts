import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Category } from '../models/Category';
import { Template } from '../models/Template';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';

interface CreateCategoryBody {
  name: string;
  description?: string;
  color?: string;
  imageUrl?: string;
}

interface UpdateCategoryBody {
  name?: string;
  description?: string;
  isActive?: boolean;
  color?: string;
  slug?: string;
  imageUrl?: string;
}

interface CategoryRequest extends FastifyRequest {
  user?: IUser;
}

export const registerCategoryRoutes = (fastify: FastifyInstance): void => {
  // Get all categories (public)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { active = 'true' } = request.query as { active?: string };
      const filter: any = {};
      
      if (active === 'true') {
        filter.isActive = true;
      }

      // Get categories
      const categories = await Category.find(filter)
        .sort({ templateCount: -1, name: 1 });

      // Calculate actual template counts for each category
      const categoriesWithRealCounts = await Promise.all(
        categories.map(async (category) => {
          const templateCount = await Template.countDocuments({ 
            category: category.name,
            isActive: true 
          });
          
          return {
            ...category.toObject(),
            templateCount
          };
        })
      );

      return { success: true, data: { categories: categoriesWithRealCounts } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching categories', error: (error as Error).message });
    }
  });

  // Get category by ID (public)
  fastify.get('/:id', async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const category = await Category.findById(id);
      
      if (!category) {
        return reply.status(404).send({ success: false, message: 'Category not found' });
      }

      return { success: true, data: { category } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching category', error: (error as Error).message });
    }
  });

  // Create category (admin only)
  fastify.post('/', { preHandler: authenticate }, async (request: CategoryRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const { name, description } = request.body as CreateCategoryBody;
      
      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Check if category already exists
      const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
      if (existingCategory) {
        return reply.status(409).send({ success: false, message: 'Category with this name or slug already exists' });
      }

      const category = new Category({
        name,
        description,
        slug,
        templateCount: 0
      });

      await category.save();

      return { success: true, data: { category } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error creating category', error: (error as Error).message });
    }
  });

  // Update category (admin only)
  fastify.put('/:id', { preHandler: authenticate }, async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      const user = request.user as IUser;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const { id } = request.params as { id: string };
      const updateData = request.body as UpdateCategoryBody;

      const category = await Category.findById(id);
      if (!category) {
        return reply.status(404).send({ success: false, message: 'Category not found' });
      }

      // If name is being updated, check for conflicts and update slug
      if (updateData.name && updateData.name !== category.name) {
        const newSlug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingCategory = await Category.findOne({ 
          $or: [{ name: updateData.name }, { slug: newSlug }],
          _id: { $ne: id }
        });
        
        if (existingCategory) {
          return reply.status(409).send({ success: false, message: 'Category with this name or slug already exists' });
        }
        
        updateData.slug = newSlug;
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      return { success: true, data: { category: updatedCategory } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error updating category', error: (error as Error).message });
    }
  });

  // Delete category (admin only)
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

      // Check if category exists
      const category = await Category.findById(id);
      if (!category) {
        return reply.status(404).send({ success: false, message: 'Category not found' });
      }

      // Check if category has templates
      const templateCount = await Template.countDocuments({ category: category.name });
      if (templateCount > 0) {
        return reply.status(400).send({ 
          success: false, 
          message: `Cannot delete category. It has ${templateCount} templates associated with it.` 
        });
      }

      await Category.findByIdAndDelete(id);

      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error deleting category', error: (error as Error).message });
    }
  });

  // Get category statistics (admin only)
  fastify.get('/stats/overview', { preHandler: authenticate }, async (request: CategoryRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Admin access required' });
      }

      const [totalCategories, activeCategories, topCategories] = await Promise.all([
        Category.countDocuments(),
        Category.countDocuments({ isActive: true }),
        Category.find({ isActive: true })
          .sort({ templateCount: -1 })
          .limit(10)
          .select('name templateCount')
      ]);

      return {
        success: true,
        stats: {
          totalCategories,
          activeCategories,
          topCategories
        }
      };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching category stats', error: (error as Error).message });
    }
  });
}; 