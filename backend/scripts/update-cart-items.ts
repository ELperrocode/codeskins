import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

// Import models
import { Cart } from '../src/models/Cart';
import { Template } from '../src/models/Template';

async function updateCartItems() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all carts
    const carts = await Cart.find({});
    console.log(`📦 Found ${carts.length} carts to update`);

    let updatedCarts = 0;
    let updatedItems = 0;

    for (const cart of carts) {
      let cartUpdated = false;

              for (const item of cart.items) {
          // Get template information
          const template = await Template.findById(item.templateId);
          if (template) {
            // Update item with additional information
            const originalItem = { ...item };
            
            item.description = template.description;
            item.previewImages = template.previewImages || [];
            item.category = template.category;
            item.tags = template.tags || [];

            // Check if item was actually updated
            const newItem = { ...item };
            if (JSON.stringify(originalItem) !== JSON.stringify(newItem)) {
              cartUpdated = true;
              updatedItems++;
            }
          }
        }

      if (cartUpdated) {
        await cart.save();
        updatedCarts++;
      }
    }

    console.log(`✅ Updated ${updatedCarts} carts with ${updatedItems} items`);
    console.log('🎉 Cart items migration completed successfully');

  } catch (error) {
    console.error('❌ Error updating cart items:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
updateCartItems(); 