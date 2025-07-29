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

// Categories with cool images for hero parallax
const categoriesWithImages = [
  {
    name: 'Web Development',
    description: 'Professional web development templates for modern applications',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'web-development',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Mobile Apps',
    description: 'Mobile-first templates for iOS and Android applications',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'mobile-apps',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'E-commerce',
    description: 'Complete e-commerce solutions for online stores',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'ecommerce',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Landing Pages',
    description: 'High-converting landing pages for marketing campaigns',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'landing-pages',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Dashboard & Admin',
    description: 'Professional admin dashboards and control panels',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'dashboard-admin',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Blog & Content',
    description: 'Content management and blogging platforms',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'blog-content',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Portfolio',
    description: 'Creative portfolio templates for professionals',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'portfolio',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Restaurant & Food',
    description: 'Templates for restaurants, cafes, and food businesses',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'restaurant-food',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Creative Agency',
    description: 'Templates for creative agencies and design studios',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'creative-agency',
    isActive: true,
    templateCount: 0
  },
  {
    name: 'Photography',
    description: 'Templates for photographers and visual artists',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    slug: 'photography',
    isActive: true,
    templateCount: 0
  }
];

async function addCategoriesWithImages() {
  try {
    await connectDB();

    console.log('Starting to add categories with images...');

    for (const categoryData of categoriesWithImages) {
      // Check if category already exists by name or slug
      const existingCategory = await Category.findOne({ 
        $or: [
          { name: categoryData.name },
          { slug: categoryData.slug }
        ]
      });
      
      if (existingCategory) {
        console.log(`Category "${categoryData.name}" already exists, updating...`);
        await Category.findOneAndUpdate(
          { _id: existingCategory._id },
          { 
            ...categoryData,
            updatedAt: new Date()
          },
          { new: true }
        );
      } else {
        console.log(`Creating new category: ${categoryData.name}`);
        const newCategory = new Category(categoryData);
        await newCategory.save();
      }
    }

    console.log('✅ Categories with images added/updated successfully!');
    
    // Display all categories
    const allCategories = await Category.find({ isActive: true }).sort({ name: 1 });
    console.log('\n📋 Current active categories:');
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.templateCount} templates) - ${cat.imageUrl ? 'Has image' : 'No image'}`);
    });

  } catch (error) {
    console.error('❌ Error adding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the script
addCategoriesWithImages(); 