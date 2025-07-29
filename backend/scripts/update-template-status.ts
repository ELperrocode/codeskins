import mongoose from 'mongoose';
import { Template } from '../src/models/Template';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeskins';

async function updateTemplateStatus() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update all templates with status 'draft' to 'active'
    const result = await Template.updateMany(
      { status: 'draft' },
      { status: 'active' }
    );

    console.log(`✅ Updated ${result.modifiedCount} templates from draft to active`);

    // Verify the update
    const draftTemplates = await Template.find({ status: 'draft' });
    const activeTemplates = await Template.find({ status: 'active' });

    console.log(`\n📊 After update:`);
    console.log(`- Draft templates: ${draftTemplates.length}`);
    console.log(`- Active templates: ${activeTemplates.length}`);

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  updateTemplateStatus();
} 