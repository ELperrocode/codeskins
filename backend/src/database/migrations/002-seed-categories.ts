import { Category } from '../../models/Category';

export async function seedCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log('📂 Categories already exist, skipping category seeding');
      return;
    }

    const categories = [
      {
        name: 'E-commerce',
        description: 'Professional online store templates with shopping cart, product catalogs, and payment integration',
        slug: 'ecommerce',
        imageUrl: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Portfolio',
        description: 'Creative portfolio templates for designers, photographers, and creative professionals',
        slug: 'portfolio',
        imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'SaaS & Apps',
        description: 'Modern SaaS application templates with dashboard, user management, and analytics',
        slug: 'saas-apps',
        imageUrl: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Landing Pages',
        description: 'High-converting landing page templates for marketing campaigns and product launches',
        slug: 'landing-pages',
        imageUrl: 'https://images.pexels.com/photos/3183156/pexels-photo-3183156.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Blog & News',
        description: 'Content-focused templates for blogs, news sites, and content management',
        slug: 'blog-news',
        imageUrl: 'https://images.pexels.com/photos/3183159/pexels-photo-3183159.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Corporate',
        description: 'Professional business templates for companies, agencies, and corporate websites',
        slug: 'corporate',
        imageUrl: 'https://images.pexels.com/photos/3183162/pexels-photo-3183162.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Restaurant & Food',
        description: 'Beautiful templates for restaurants, cafes, and food delivery services',
        slug: 'restaurant-food',
        imageUrl: 'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Real Estate',
        description: 'Property listing templates with search, filters, and property showcase features',
        slug: 'real-estate',
        imageUrl: 'https://images.pexels.com/photos/3183168/pexels-photo-3183168.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Education',
        description: 'Learning platform templates for schools, courses, and educational content',
        slug: 'education',
        imageUrl: 'https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
      {
        name: 'Healthcare',
        description: 'Medical and healthcare templates for clinics, hospitals, and health services',
        slug: 'healthcare',
        imageUrl: 'https://images.pexels.com/photos/3183174/pexels-photo-3183174.jpeg?w=800&h=600&fit=crop',
        isActive: true,
        templateCount: 0,
      },
    ];

    await Category.insertMany(categories);
    console.log(`✅ Created ${categories.length} categories successfully`);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
} 