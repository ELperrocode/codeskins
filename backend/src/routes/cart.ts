import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Cart } from '../models/Cart';
import { Template } from '../models/Template';
import { License } from '../models/License';
import { authenticate } from '../middleware/auth';
import { IUser } from '../models/User';

interface AddToCartBody {
  templateId: string;
  quantity?: number;
}

interface UpdateCartItemBody {
  templateId: string;
  quantity: number;
}

interface CartRequest extends FastifyRequest {
  user?: IUser;
}

export const registerCartRoutes = (fastify: FastifyInstance): void => {
  // Get user's cart
  fastify.get('/', { preHandler: authenticate }, async (request: CartRequest, reply: FastifyReply) => {
    try {
      const userId = request.user?._id;
      if (!userId) {
        return reply.status(401).send({ success: false, message: 'User not authenticated' });
      }
      
      let cart = await Cart.findOne({ userId });
      
      if (!cart) {
        cart = new Cart({ userId, items: [], total: 0 });
        await cart.save();
      }
      
      return { success: true, data: { cart } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error fetching cart', error: (error as Error).message });
    }
  });

  // Add item to cart
  fastify.post('/add', { preHandler: authenticate }, async (request: CartRequest, reply: FastifyReply) => {
    try {
      const { templateId, quantity = 1 } = request.body as AddToCartBody;
      const userId = request.user?._id;
      if (!userId) {
        return reply.status(401).send({ success: false, message: 'User not authenticated' });
      }

      // Verify template exists and is active
      const template = await Template.findOne({ _id: templateId, isActive: true }).populate('licenseId');
      if (!template) {
        return reply.status(404).send({ success: false, message: 'Template not found or inactive' });
      }

      // Validate license and download limits
      if (template.licenseId) {
        const license = template.licenseId as any;
        if (license.maxDownloads !== -1 && quantity > license.maxDownloads) {
          return reply.status(400).send({ 
            success: false, 
            message: `Cannot add ${quantity} items. This template has a limit of ${license.maxDownloads} downloads per license.` 
          });
        }
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], total: 0 });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(item => 
        item.templateId.toString() === templateId
      );

      if (existingItemIndex > -1 && cart.items[existingItemIndex]) {
        // Update quantity
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        
        // Validate total quantity against license limits
        if (template.licenseId) {
          const license = template.licenseId as any;
          if (license.maxDownloads !== -1 && newQuantity > license.maxDownloads) {
            return reply.status(400).send({ 
              success: false, 
              message: `Cannot add ${quantity} more items. Total quantity (${newQuantity}) would exceed the limit of ${license.maxDownloads} downloads.` 
            });
          }
        }
        
        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item with additional information
        cart.items.push({
          templateId: template._id as any,
          title: template.title,
          description: template.description,
          price: template.price,
          quantity,
          previewImages: template.previewImages || [],
          category: template.category,
          tags: template.tags || []
        });
      }

      await cart.save();

      return { success: true, data: { cart } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error adding item to cart', error: (error as Error).message });
    }
  });

  // Update cart item quantity
  fastify.put('/update', { preHandler: authenticate }, async (request: CartRequest, reply: FastifyReply) => {
    try {
      const { templateId, quantity } = request.body as UpdateCartItemBody;
      const userId = request.user?._id;
      if (!userId) {
        return reply.status(401).send({ success: false, message: 'User not authenticated' });
      }

      if (quantity <= 0) {
        return reply.status(400).send({ success: false, message: 'Quantity must be greater than 0' });
      }

      // Get template with license info for validation
      const template = await Template.findOne({ _id: templateId, isActive: true }).populate('licenseId');
      if (!template) {
        return reply.status(404).send({ success: false, message: 'Template not found or inactive' });
      }

      // Validate license and download limits
      if (template.licenseId) {
        const license = template.licenseId as any;
        if (license.maxDownloads !== -1 && quantity > license.maxDownloads) {
          return reply.status(400).send({ 
            success: false, 
            message: `Cannot set quantity to ${quantity}. This template has a limit of ${license.maxDownloads} downloads per license.` 
          });
        }
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return reply.status(404).send({ success: false, message: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => 
        item.templateId.toString() === templateId
      );

      if (itemIndex === -1) {
        return reply.status(404).send({ success: false, message: 'Item not found in cart' });
      }

      if (cart.items[itemIndex]) {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();

      return { success: true, data: { cart } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error updating cart', error: (error as Error).message });
    }
  });

  // Remove item from cart
  fastify.delete('/remove/:templateId', { preHandler: authenticate }, async (request: CartRequest, reply: FastifyReply) => {
    try {
      const { templateId } = request.params as { templateId: string };
      const userId = request.user?._id;
      if (!userId) {
        return reply.status(401).send({ success: false, message: 'User not authenticated' });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return reply.status(404).send({ success: false, message: 'Cart not found' });
      }

      cart.items = cart.items.filter(item => 
        item.templateId.toString() !== templateId
      );

      await cart.save();

      return { success: true, data: { cart } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error removing item from cart', error: (error as Error).message });
    }
  });

  // Clear cart
  fastify.delete('/clear', { preHandler: authenticate }, async (request: CartRequest, reply: FastifyReply) => {
    try {
      const userId = request.user?._id;
      if (!userId) {
        return reply.status(401).send({ success: false, message: 'User not authenticated' });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return reply.status(404).send({ success: false, message: 'Cart not found' });
      }

      cart.items = [];
      await cart.save();

      return { success: true, data: { cart } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error clearing cart', error: (error as Error).message });
    }
  });

  // Get cart count (for header display)
  fastify.get('/count', { preHandler: authenticate }, async (request: CartRequest, reply: FastifyReply) => {
    try {
      const userId = request.user?._id;
      if (!userId) {
        return reply.status(401).send({ success: false, message: 'User not authenticated' });
      }

      const cart = await Cart.findOne({ userId });
      const itemCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

      return { success: true, data: { count: itemCount } };
    } catch (error) {
      reply.status(500).send({ success: false, message: 'Error getting cart count', error: (error as Error).message });
    }
  });
}; 