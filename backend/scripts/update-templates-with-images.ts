import mongoose from 'mongoose';
import { Template } from '../src/models/Template';

// Template data with multiple website images and preview URLs
const templateUpdates = [
  {
    title: "Photography Studio",
    previewImages: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://photography-studio-template.vercel.app"
  },
  {
    title: "Blog & Magazine",
    previewImages: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://blog-magazine-template.vercel.app"
  },
  {
    title: "Startup Landing Page",
    previewImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://startup-landing-template.vercel.app"
  },
  {
    title: "Creative Agency",
    previewImages: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://creative-agency-template.vercel.app"
  },
  {
    title: "Restaurant & Food",
    previewImages: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://restaurant-food-template.vercel.app"
  },
  {
    title: "Corporate Business",
    previewImages: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://corporate-business-template.vercel.app"
  },
  {
    title: "Portfolio Showcase",
    previewImages: [
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://portfolio-showcase-template.vercel.app"
  },
  {
    title: "E-commerce Store",
    previewImages: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://ecommerce-store-template.vercel.app"
  },
  {
    title: "Personal Blog",
    previewImages: [
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://personal-blog-template.vercel.app"
  },
  {
    title: "Tech Startup",
    previewImages: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://tech-startup-template.vercel.app"
  },
  {
    title: "Design Agency",
    previewImages: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://design-agency-template.vercel.app"
  },
  {
    title: "Fitness & Health",
    previewImages: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://fitness-health-template.vercel.app"
  },
  {
    title: "Education Platform",
    previewImages: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://education-platform-template.vercel.app"
  },
  {
    title: "Real Estate",
    previewImages: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://real-estate-template.vercel.app"
  },
  {
    title: "Travel & Tourism",
    previewImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&crop=center"
    ],
    previewUrl: "https://travel-tourism-template.vercel.app"
  }
];

async function updateTemplates() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeskins';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let updatedCount = 0;

    for (const update of templateUpdates) {
      const template = await Template.findOne({ title: update.title });
      
      if (template) {
        template.previewImages = update.previewImages;
        template.previewUrl = update.previewUrl;
        await template.save();
        console.log(`✅ Updated: ${update.title}`);
        updatedCount++;
      } else {
        console.log(`❌ Not found: ${update.title}`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} templates with multiple images and preview URLs!`);
    
    // Show some examples
    const examples = await Template.find({ previewUrl: { $exists: true } }).limit(3);
    console.log('\n📸 Examples of updated templates:');
    examples.forEach(template => {
      console.log(`- ${template.title}: ${template.previewImages?.length || 0} images, Preview: ${template.previewUrl}`);
    });

  } catch (error) {
    console.error('Error updating templates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
updateTemplates(); 