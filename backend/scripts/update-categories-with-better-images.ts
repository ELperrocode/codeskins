import mongoose from 'mongoose';
import { Category } from '../src/models/Category';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env['MONGODB_URI'] || 'mongodb://localhost:27017/codeskins');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Better images for existing categories
const categoryImageUpdates = [
  {
    name: 'Agency',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Professional agency templates for creative businesses'
  },
  {
    name: 'Blog',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Content management and blogging platforms'
  },
  {
    name: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Professional corporate and business templates'
  },
  {
    name: 'Restaurant',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Templates for restaurants and food businesses'
  },
  {
    name: 'Startup',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Modern startup and SaaS templates'
  }
];

async function updateCategoriesWithBetterImages() {
  try {
    await connectDB();

    console.log('Starting to update categories with better images...');

    for (const updateData of categoryImageUpdates) {
      // Find category by name
      const existingCategory = await Category.findOne({ name: updateData.name });
      
      if (existingCategory) {
        console.log(`Updating category "${updateData.name}" with new image...`);
        await Category.findOneAndUpdate(
          { _id: existingCategory._id },
          { 
            imageUrl: updateData.imageUrl,
            description: updateData.description,
            updatedAt: new Date()
          },
          { new: true }
        );
      } else {
        console.log(`Category "${updateData.name}" not found, skipping...`);
      }
    }

    console.log('✅ Categories updated with better images successfully!');
    
    // Display all categories with their image status
    const allCategories = await Category.find({ isActive: true }).sort({ name: 1 });
    console.log('\n📋 Current categories with image status:');
    allCategories.forEach(cat => {
      const imageStatus = cat.imageUrl ? '✅ Has image' : '❌ No image';
      console.log(`  - ${cat.name} (${cat.templateCount} templates) - ${imageStatus}`);
    });

  } catch (error) {
    console.error('❌ Error updating categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the script
updateCategoriesWithBetterImages(); 