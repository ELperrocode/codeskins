import mongoose from 'mongoose';
import { Category } from '../src/models/Category';
import { Template } from '../src/models/Template';

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

async function updateCategoryTemplateCounts() {
  try {
    await connectDB();

    console.log('Starting to update category template counts...');

    // Get all categories
    const categories = await Category.find({ isActive: true });
    
    console.log(`Found ${categories.length} active categories`);

    for (const category of categories) {
      // Count templates for this category
      const templateCount = await Template.countDocuments({ 
        category: category.name,
        isActive: true 
      });
      
      console.log(`Category "${category.name}": ${templateCount} templates`);
      
      // Update the category with the real count
      await Category.findByIdAndUpdate(
        category._id,
        { templateCount },
        { new: true }
      );
    }

    console.log('✅ Category template counts updated successfully!');
    
    // Display final counts
    const updatedCategories = await Category.find({ isActive: true }).sort({ name: 1 });
    console.log('\n📋 Final category template counts:');
    updatedCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.templateCount} templates`);
    });

    // Calculate total templates
    const totalTemplates = updatedCategories.reduce((sum, cat) => sum + cat.templateCount, 0);
    console.log(`\n📊 Total templates across all categories: ${totalTemplates}`);

  } catch (error) {
    console.error('❌ Error updating category template counts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the script
updateCategoryTemplateCounts(); 