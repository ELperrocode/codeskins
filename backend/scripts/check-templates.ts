import mongoose from 'mongoose';
import { Template } from '../src/models/Template';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeskins';

async function checkTemplates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all templates without any filters
    const allTemplates = await Template.find({});
    console.log(`\n📊 Total templates in database: ${allTemplates.length}`);

    // Get active templates
    const activeTemplates = await Template.find({ isActive: true });
    console.log(`📊 Active templates: ${activeTemplates.length}`);

    // Get inactive templates
    const inactiveTemplates = await Template.find({ isActive: false });
    console.log(`📊 Inactive templates: ${inactiveTemplates.length}`);

    console.log('\n📋 All templates:');
    allTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} (isActive: ${template.isActive})`);
    });

    console.log('\n📋 Active templates:');
    activeTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title}`);
    });

  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  checkTemplates();
} 