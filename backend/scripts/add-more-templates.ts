import mongoose from 'mongoose';
import { Template } from '../src/models/Template';
import { User } from '../src/models/User';
import { License } from '../src/models/License';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeskins';

const additionalTemplates = [
  {
    title: "E-commerce Dashboard",
    description: "Modern e-commerce dashboard with analytics, order management, and inventory tracking",
    price: 89,
    category: "E-commerce",
    tags: ["ecommerce", "dashboard", "analytics", "modern"],
    previewImages: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center"],
    features: ["Responsive Design", "Analytics Dashboard", "Order Management", "Inventory Tracking", "Customer Management"],
    downloads: 156,
    sales: 23,
    rating: 4.8,
    reviewCount: 12
  },
  {
    title: "SaaS Landing Page",
    description: "Professional SaaS landing page with modern design and conversion optimization",
    price: 67,
    category: "SaaS",
    tags: ["saas", "landing", "conversion", "modern"],
    previewImages: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center"],
    features: ["Hero Section", "Feature Showcase", "Pricing Tables", "Testimonials", "Contact Forms"],
    downloads: 203,
    sales: 45,
    rating: 4.9,
    reviewCount: 28
  },
  {
    title: "Restaurant Menu",
    description: "Beautiful restaurant menu template with food photography and online ordering",
    price: 45,
    category: "Food & Restaurant",
    tags: ["restaurant", "food", "menu", "ordering"],
    previewImages: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&crop=center"],
    features: ["Menu Display", "Online Ordering", "Food Gallery", "Reservation System", "Mobile Optimized"],
    downloads: 89,
    sales: 15,
    rating: 4.6,
    reviewCount: 8
  },
  {
    title: "Portfolio Gallery",
    description: "Creative portfolio gallery for photographers, designers, and artists",
    price: 55,
    category: "Portfolio",
    tags: ["portfolio", "gallery", "creative", "photography"],
    previewImages: ["https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&crop=center"],
    features: ["Image Gallery", "Lightbox View", "Filter Categories", "Contact Form", "Social Integration"],
    downloads: 134,
    sales: 32,
    rating: 4.7,
    reviewCount: 19
  },
  {
    title: "Educational Platform",
    description: "Complete educational platform for online courses and learning management",
    price: 120,
    category: "Education",
    tags: ["education", "courses", "learning", "platform"],
    previewImages: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"],
    features: ["Course Management", "Student Dashboard", "Progress Tracking", "Video Player", "Quiz System"],
    downloads: 78,
    sales: 12,
    rating: 4.5,
    reviewCount: 6
  },
  {
    title: "Real Estate Listings",
    description: "Professional real estate website with property listings and search functionality",
    price: 95,
    category: "Real Estate",
    tags: ["real-estate", "property", "listings", "search"],
    previewImages: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&crop=center"],
    features: ["Property Listings", "Advanced Search", "Map Integration", "Contact Forms", "Property Details"],
    downloads: 67,
    sales: 8,
    rating: 4.4,
    reviewCount: 5
  },
  {
    title: "Travel Blog",
    description: "Beautiful travel blog template with stunning imagery and storytelling features",
    price: 75,
    category: "Travel",
    tags: ["travel", "blog", "photography", "stories"],
    previewImages: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=center"],
    features: ["Blog Posts", "Image Galleries", "Travel Maps", "Social Sharing", "Newsletter Signup"],
    downloads: 112,
    sales: 18,
    rating: 4.8,
    reviewCount: 14
  },
  {
    title: "Fitness & Health",
    description: "Modern fitness website with workout plans, nutrition guides, and progress tracking",
    price: 85,
    category: "Health & Fitness",
    tags: ["fitness", "health", "workout", "nutrition"],
    previewImages: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&crop=center"],
    features: ["Workout Plans", "Nutrition Guides", "Progress Tracking", "Member Portal", "Mobile App"],
    downloads: 145,
    sales: 27,
    rating: 4.6,
    reviewCount: 16
  },
  {
    title: "Creative Agency",
    description: "Bold and creative agency website showcasing services and portfolio work",
    price: 110,
    category: "Agency",
    tags: ["agency", "creative", "services", "portfolio"],
    previewImages: ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&crop=center"],
    features: ["Service Showcase", "Portfolio Gallery", "Team Profiles", "Client Testimonials", "Contact Forms"],
    downloads: 98,
    sales: 22,
    rating: 4.9,
    reviewCount: 11
  },
  {
    title: "Tech Startup",
    description: "Modern tech startup website with product showcase and investor information",
    price: 130,
    category: "Technology",
    tags: ["startup", "tech", "product", "modern"],
    previewImages: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&crop=center"],
    features: ["Product Demo", "Team Profiles", "Investor Relations", "Press Kit", "Careers Page"],
    downloads: 76,
    sales: 14,
    rating: 4.7,
    reviewCount: 9
  },
  {
    title: "Design Studio",
    description: "Elegant design studio website with portfolio showcase and client testimonials",
    price: 90,
    category: "Design",
    tags: ["design", "studio", "portfolio", "elegant"],
    previewImages: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center"],
    features: ["Portfolio Gallery", "Client Testimonials", "Service Overview", "Process Showcase", "Contact Forms"],
    downloads: 123,
    sales: 31,
    rating: 4.8,
    reviewCount: 17
  },
  {
    title: "Personal Blog",
    description: "Clean and minimal personal blog template for writers and content creators",
    price: 40,
    category: "Blog",
    tags: ["blog", "personal", "minimal", "clean"],
    previewImages: ["https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop&crop=center"],
    features: ["Blog Posts", "Author Profile", "Social Sharing", "Newsletter", "Comments System"],
    downloads: 167,
    sales: 38,
    rating: 4.5,
    reviewCount: 23
  }
];

async function addMoreTemplates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get admin user and standard license
    const adminUser = await User.findOne({ role: 'admin' });
    const standardLicense = await License.findOne({ name: 'Standard License' });

    if (!adminUser) {
      console.error('❌ Admin user not found');
      process.exit(1);
    }

    if (!standardLicense) {
      console.error('❌ Standard License not found');
      process.exit(1);
    }

    console.log('📦 Adding additional templates...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const templateData of additionalTemplates) {
      const existingTemplate = await Template.findOne({ title: templateData.title });
      if (existingTemplate) {
        console.log(`⏭️  Template "${templateData.title}" already exists`);
        skippedCount++;
        continue;
      }

      const template = new Template({
        ...templateData,
        fileUrl: `uploads/downloads/${templateData.title.toLowerCase().replace(/\s+/g, '-')}.zip`,
        ownerId: adminUser._id,
        licenseId: standardLicense._id,
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await template.save();
      console.log(`✅ Added template: ${templateData.title}`);
      addedCount++;
    }

    console.log('\n🎉 Template addition completed!');
    console.log(`- Added: ${addedCount} templates`);
    console.log(`- Skipped: ${skippedCount} templates`);

  } catch (error) {
    console.error('❌ Template addition failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addMoreTemplates();
} 