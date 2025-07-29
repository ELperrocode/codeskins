import mongoose from 'mongoose';
import { User } from '../src/models/User';
import { Template } from '../src/models/Template';
import { License } from '../src/models/License';
import { Category } from '../src/models/Category';
import { Tag } from '../src/models/Tag';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: 'E-commerce',
    description: 'Online store and shopping templates',
    slug: 'e-commerce'
  },
  {
    name: 'Portfolio',
    description: 'Personal and professional portfolio templates',
    slug: 'portfolio'
  },
  {
    name: 'Corporate',
    description: 'Business and corporate website templates',
    slug: 'corporate'
  },
  {
    name: 'Restaurant',
    description: 'Food and restaurant website templates',
    slug: 'restaurant'
  },
  {
    name: 'Agency',
    description: 'Creative agency and service templates',
    slug: 'agency'
  },
  {
    name: 'Startup',
    description: 'Startup and SaaS landing page templates',
    slug: 'startup'
  },
  {
    name: 'Blog',
    description: 'Blog and content management templates',
    slug: 'blog'
  },
  {
    name: 'Photography',
    description: 'Photography and gallery templates',
    slug: 'photography'
  }
];

const tags = [
  { name: 'responsive', description: 'Mobile-friendly design', color: '#10B981' },
  { name: 'modern', description: 'Contemporary design style', color: '#3B82F6' },
  { name: 'ecommerce', description: 'Online shopping features', color: '#F59E0B' },
  { name: 'portfolio', description: 'Showcase work and projects', color: '#8B5CF6' },
  { name: 'creative', description: 'Artistic and creative design', color: '#EC4899' },
  { name: 'elegant', description: 'Sophisticated and refined', color: '#6B7280' },
  { name: 'business', description: 'Professional business features', color: '#059669' },
  { name: 'landing', description: 'High-converting landing pages', color: '#DC2626' },
  { name: 'saas', description: 'Software as a Service templates', color: '#7C3AED' },
  { name: 'shopping', description: 'Shopping cart and checkout', color: '#EA580C' },
  { name: 'menu', description: 'Food menu and ordering', color: '#D97706' },
  { name: 'booking', description: 'Appointment and reservation system', color: '#0891B2' },
  { name: 'gallery', description: 'Image and media galleries', color: '#BE185D' },
  { name: 'blog', description: 'Content and blog management', color: '#059669' },
  { name: 'typography', description: 'Beautiful text and fonts', color: '#374151' },
  { name: 'conversion', description: 'High conversion rate design', color: '#DC2626' },
  { name: 'services', description: 'Service showcase features', color: '#7C2D12' },
  { name: 'testimonials', description: 'Customer reviews and feedback', color: '#1E40AF' }
];

const templates = [
  {
    title: 'Modern E-commerce Template',
    description: 'A fully responsive e-commerce template with modern design, shopping cart, and payment integration.',
    category: 'E-commerce',
    tags: ['ecommerce', 'responsive', 'modern', 'shopping'],
    price: 49.99,
    features: [
      'Responsive Design',
      'Shopping Cart',
      'Payment Integration',
      'Product Catalog',
      'User Authentication',
      'Admin Dashboard'
    ],
    fileUrl: '/templates/ecommerce-template.zip',
    previewImage: '/images/templates/ecommerce-preview.jpg',
    status: 'active'
  },
  {
    title: 'Portfolio Showcase',
    description: 'Elegant portfolio template perfect for designers, photographers, and creative professionals.',
    category: 'Portfolio',
    tags: ['portfolio', 'creative', 'elegant', 'showcase'],
    price: 29.99,
    features: [
      'Gallery Layout',
      'Project Showcase',
      'Contact Form',
      'Social Media Integration',
      'Blog Section',
      'SEO Optimized'
    ],
    fileUrl: '/templates/portfolio-template.zip',
    previewImage: '/images/templates/portfolio-preview.jpg',
    status: 'active'
  },
  {
    title: 'Corporate Business Site',
    description: 'Professional corporate website template with modern design and comprehensive business features.',
    category: 'Corporate',
    tags: ['corporate', 'business', 'professional', 'modern'],
    price: 79.99,
    features: [
      'Company Profile',
      'Team Section',
      'Services Overview',
      'Contact Information',
      'News/Blog',
      'Multi-page Layout'
    ],
    fileUrl: '/templates/corporate-template.zip',
    previewImage: '/images/templates/corporate-preview.jpg',
    status: 'active'
  },
  {
    title: 'Restaurant & Food',
    description: 'Beautiful restaurant website template with menu showcase, online ordering, and reservation system.',
    category: 'Restaurant',
    tags: ['restaurant', 'food', 'menu', 'ordering'],
    price: 39.99,
    features: [
      'Menu Display',
      'Online Ordering',
      'Reservation System',
      'Gallery',
      'Location Map',
      'Reviews Section'
    ],
    fileUrl: '/templates/restaurant-template.zip',
    previewImage: '/images/templates/restaurant-preview.jpg',
    status: 'active'
  },
  {
    title: 'Creative Agency',
    description: 'Dynamic agency website template with portfolio, services, and client showcase sections.',
    category: 'Agency',
    tags: ['agency', 'creative', 'services', 'portfolio'],
    price: 59.99,
    features: [
      'Service Showcase',
      'Client Portfolio',
      'Team Profiles',
      'Project Gallery',
      'Contact Forms',
      'Testimonials'
    ],
    fileUrl: '/templates/agency-template.zip',
    previewImage: '/images/templates/agency-preview.jpg',
    status: 'active'
  },
  {
    title: 'Startup Landing Page',
    description: 'High-converting landing page template designed for startups and SaaS companies.',
    category: 'Startup',
    tags: ['startup', 'landing', 'saas', 'conversion'],
    price: 34.99,
    features: [
      'Hero Section',
      'Feature Highlights',
      'Pricing Tables',
      'Testimonials',
      'Call-to-Action',
      'Newsletter Signup'
    ],
    fileUrl: '/templates/startup-template.zip',
    previewImage: '/images/templates/startup-preview.jpg',
    status: 'active'
  },
  {
    title: 'Blog & Magazine',
    description: 'Modern blog template with clean typography, social sharing, and content management features.',
    category: 'Blog',
    tags: ['blog', 'magazine', 'content', 'typography'],
    price: 24.99,
    features: [
      'Article Layout',
      'Category Pages',
      'Search Functionality',
      'Social Sharing',
      'Comment System',
      'Newsletter Integration'
    ],
    fileUrl: '/templates/blog-template.zip',
    previewImage: '/images/templates/blog-preview.jpg',
    status: 'active'
  },
  {
    title: 'Photography Studio',
    description: 'Stunning photography website template with gallery, booking system, and client portal.',
    category: 'Photography',
    tags: ['photography', 'gallery', 'studio', 'booking'],
    price: 44.99,
    features: [
      'Photo Gallery',
      'Booking System',
      'Client Portal',
      'Pricing Packages',
      'Testimonials',
      'Contact Forms'
    ],
    fileUrl: '/templates/photography-template.zip',
    previewImage: '/images/templates/photography-preview.jpg',
    status: 'active'
  }
];

const licenses = [
  {
    name: 'Standard License',
    description: 'Single use license for one project',
    maxDownloads: 1,
    isActive: true
  },
  {
    name: 'Extended License',
    description: 'Multiple use license for unlimited projects',
    maxDownloads: -1,
    isActive: true
  },
  {
    name: 'Developer License',
    description: 'License for developers to use in client projects',
    maxDownloads: -1,
    isActive: true
  }
];

async function migrateData() {
  try {
    console.log('🚀 Starting database migration...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/codeskins?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create default licenses
    console.log('📄 Creating licenses...');
    const createdLicenses = await Promise.all(
      licenses.map(async (licenseData) => {
        const existingLicense = await License.findOne({ name: licenseData.name });
        if (existingLicense) {
          console.log(`License "${licenseData.name}" already exists`);
          return existingLicense;
        }
        const license = new License(licenseData);
        await license.save();
        console.log(`✅ Created license: ${licenseData.name}`);
        return license;
      })
    );

    // Create categories
    console.log('📂 Creating categories...');
    const createdCategories = await Promise.all(
      categories.map(async (categoryData) => {
        const existingCategory = await Category.findOne({ name: categoryData.name });
        if (existingCategory) {
          console.log(`Category "${categoryData.name}" already exists`);
          return existingCategory;
        }
        const category = new Category(categoryData);
        await category.save();
        console.log(`✅ Created category: ${categoryData.name}`);
        return category;
      })
    );

    // Create tags
    console.log('🏷️ Creating tags...');
    const createdTags = await Promise.all(
      tags.map(async (tagData) => {
        const existingTag = await Tag.findOne({ name: tagData.name });
        if (existingTag) {
          console.log(`Tag "${tagData.name}" already exists`);
          return existingTag;
        }
        // Generate slug from name
        const slug = tagData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const tag = new Tag({
          ...tagData,
          slug,
          templateCount: 0
        });
        await tag.save();
        console.log(`✅ Created tag: ${tagData.name}`);
        return tag;
      })
    );

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@codeskins.com';
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      adminUser = new User({
        username: 'admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        status: 'active'
      });
      await adminUser.save();
      console.log('✅ Created admin user');
    } else {
      console.log('Admin user already exists');
    }

    // Create templates
    console.log('📦 Creating templates...');
    const standardLicense = createdLicenses.find(l => l.name === 'Standard License');
    
    for (const templateData of templates) {
      const existingTemplate = await Template.findOne({ title: templateData.title });
      if (existingTemplate) {
        console.log(`Template "${templateData.title}" already exists`);
        continue;
      }

      // Find category and tags
      const category = createdCategories.find(c => c.name === templateData.category);
      const templateTags = createdTags.filter(t => templateData.tags.includes(t.name));

      // Migrar previewImage a previewImages
      let previewImages: string[] = [];
      if (templateData.previewImage) {
        previewImages = [templateData.previewImage];
      }
      
      // Excluir previewImage del objeto a guardar
      const { previewImage, ...rest } = templateData;
      const template = new Template({
        ...rest,
        previewImages,
        ownerId: adminUser._id,
        licenseId: standardLicense?._id,
        downloads: Math.floor(Math.random() * 100),
        sales: Math.floor(Math.random() * 50),
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 20) + 1
      });
      await template.save();
      console.log(`✅ Created template: ${templateData.title}`);
    }

    // Update existing templates to use ownerId instead of sellerId
    console.log('🔄 Updating existing templates...');
    const updateResult = await Template.updateMany(
      { sellerId: { $exists: true } },
      [
        {
          $set: {
            ownerId: '$sellerId',
            sellerId: '$$REMOVE'
          }
        }
      ]
    );
    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Updated ${updateResult.modifiedCount} templates from sellerId to ownerId`);
    }

    // Update category and tag counts
    console.log('📊 Updating category and tag counts...');
    for (const category of createdCategories) {
      const count = await Template.countDocuments({ category: category.name });
      await Category.findByIdAndUpdate(category._id, { templateCount: count });
    }

    for (const tag of createdTags) {
      const count = await Template.countDocuments({ tags: tag.name });
      await Tag.findByIdAndUpdate(tag._id, { templateCount: count });
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ${createdLicenses.length} licenses created`);
    console.log(`- ${createdCategories.length} categories created`);
    console.log(`- ${createdTags.length} tags created`);
    console.log(`- Admin user: ${adminEmail} / admin123`);
    console.log(`- ${templates.length} templates created`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData();
} 