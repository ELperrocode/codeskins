import mongoose from 'mongoose';
import { Template } from '../src/models/Template';
import { Tag } from '../src/models/Tag';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeskins';

async function fixTemplateTags() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all tags for reference
    const allTags = await Tag.find({ isActive: true });
    const tagMap = new Map();
    
    // Create a map of ID to name
    allTags.forEach(tag => {
      tagMap.set((tag._id as any).toString(), tag.name);
    });

    console.log('📋 Tag mapping created:');
    tagMap.forEach((name, id) => {
      console.log(`  ${id} → ${name}`);
    });

    // Get all templates
    const templates = await Template.find({});
    console.log(`\n🔍 Found ${templates.length} templates to process`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const template of templates) {
      const originalTags = [...template.tags];
      const newTags: string[] = [];

      for (const tag of template.tags) {
        // Check if it's an ObjectId (24 character hex string)
        if (/^[0-9a-fA-F]{24}$/.test(tag)) {
          // It's an ID, convert to name
          const tagName = tagMap.get(tag);
          if (tagName) {
            newTags.push(tagName);
            console.log(`  ${template.title}: ${tag} → ${tagName}`);
          } else {
            console.log(`  ⚠️  ${template.title}: Tag ID ${tag} not found, keeping as is`);
            newTags.push(tag);
          }
        } else {
          // It's already a name, keep it
          newTags.push(tag);
        }
      }

      // Remove duplicates
      const uniqueTags = [...new Set(newTags)];

      // Check if tags actually changed
      if (JSON.stringify(originalTags.sort()) !== JSON.stringify(uniqueTags.sort())) {
        template.tags = uniqueTags;
        await template.save();
        updatedCount++;
        console.log(`  ✅ Updated ${template.title}: [${originalTags.join(', ')}] → [${uniqueTags.join(', ')}]`);
      } else {
        skippedCount++;
        console.log(`  ⏭️  Skipped ${template.title}: no changes needed`);
      }
    }

    console.log('\n🎉 Fix completed!');
    console.log(`- Updated: ${updatedCount} templates`);
    console.log(`- Skipped: ${skippedCount} templates`);

  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run fix if this file is executed directly
if (require.main === module) {
  fixTemplateTags();
} 