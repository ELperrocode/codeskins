import { Template } from '../../models/Template';
import { User } from '../../models/User';
import { Category } from '../../models/Category';
import { Tag } from '../../models/Tag';
import { License } from '../../models/License';

export async function seedTemplates() {
  try {
    // Check if templates already exist
    const existingTemplates = await Template.countDocuments();
    if (existingTemplates > 0) {
      console.log('🎨 Templates already exist, skipping template seeding');
      return;
    }

    // Get admin user for ownership
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Get categories
    const categories = await Category.find({ isActive: true });
    const categoryMap = new Map(categories.map(cat => [cat.slug, cat._id]));

    // Get tags
    const tags = await Tag.find({ isActive: true });
    const tagMap = new Map(tags.map(tag => [tag.slug, tag._id]));

    // Get licenses
    const licenses = await License.find({ isActive: true });
    const commercialLicense = licenses.find(l => l.name === 'Commercial License');
    const personalLicense = licenses.find(l => l.name === 'Personal License');

    const templates = [
      {
        ownerId: adminUser._id,
        title: 'Elegant E-commerce Store',
        description: 'A modern, responsive e-commerce template with advanced product filtering, shopping cart, and payment integration. Perfect for online stores looking to provide an exceptional shopping experience.',
        category: categoryMap.get('ecommerce'),
        tags: [tagMap.get('react'), tagMap.get('typescript'), tagMap.get('tailwind'), tagMap.get('responsive'), tagMap.get('ecommerce-feature')],
        fileUrl: 'https://example.com/templates/elegant-ecommerce.zip',
        previewUrl: 'https://elegant-ecommerce-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/5632403/pexels-photo-5632403.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/5632404/pexels-photo-5632404.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: commercialLicense?._id,
        price: 89.99,
        downloads: 245,
        sales: 89,
        rating: 4.8,
        reviewCount: 23,
        features: [
          'Responsive product grid',
          'Advanced filtering system',
          'Shopping cart functionality',
          'Payment gateway integration',
          'Admin dashboard',
          'Inventory management',
          'Order tracking',
          'Customer reviews',
          'Wishlist functionality',
          'Mobile-optimized checkout'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
      {
        ownerId: adminUser._id,
        title: 'Creative Portfolio Pro',
        description: 'A stunning portfolio template designed for creative professionals. Features smooth animations, project showcases, and contact forms to help you stand out in the digital world.',
        category: categoryMap.get('portfolio'),
        tags: [tagMap.get('react'), tagMap.get('nextjs'), tagMap.get('animation'), tagMap.get('modern'), tagMap.get('portfolio-tag')],
        fileUrl: 'https://example.com/templates/creative-portfolio.zip',
        previewUrl: 'https://creative-portfolio-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183151/pexels-photo-3183151.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183152/pexels-photo-3183152.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: personalLicense?._id,
        price: 49.99,
        downloads: 189,
        sales: 67,
        rating: 4.9,
        reviewCount: 18,
        features: [
          'Project showcase gallery',
          'Smooth scroll animations',
          'Contact form integration',
          'Blog section',
          'Social media links',
          'Dark/Light mode toggle',
          'SEO optimized',
          'Fast loading',
          'Mobile responsive',
          'Customizable color schemes'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
      {
        ownerId: adminUser._id,
        title: 'SaaS Dashboard',
        description: 'A comprehensive SaaS dashboard template with user management, analytics, and subscription handling. Built for modern SaaS applications that need powerful admin capabilities.',
        category: categoryMap.get('saas-apps'),
        tags: [tagMap.get('react'), tagMap.get('typescript'), tagMap.get('dashboard'), tagMap.get('authentication'), tagMap.get('api')],
        fileUrl: 'https://example.com/templates/saas-dashboard.zip',
        previewUrl: 'https://saas-dashboard-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183154/pexels-photo-3183154.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183155/pexels-photo-3183155.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: commercialLicense?._id,
        price: 129.99,
        downloads: 156,
        sales: 89,
        rating: 4.7,
        reviewCount: 31,
        features: [
          'User management system',
          'Analytics dashboard',
          'Subscription handling',
          'Role-based access control',
          'Real-time notifications',
          'Data visualization charts',
          'API documentation',
          'Multi-tenant support',
          'Billing integration',
          'Advanced reporting'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
      {
        ownerId: adminUser._id,
        title: 'High-Converting Landing Page',
        description: 'A conversion-focused landing page template with compelling copy, social proof, and optimized forms. Designed to maximize conversions for your marketing campaigns.',
        category: categoryMap.get('landing-pages'),
        tags: [tagMap.get('react'), tagMap.get('tailwind'), tagMap.get('responsive'), tagMap.get('modern'), tagMap.get('landing-page')],
        fileUrl: 'https://example.com/templates/high-converting-landing.zip',
        previewUrl: 'https://landing-page-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/3183156/pexels-photo-3183156.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183157/pexels-photo-3183157.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: personalLicense?._id,
        price: 39.99,
        downloads: 312,
        sales: 145,
        rating: 4.6,
        reviewCount: 42,
        features: [
          'Hero section with CTA',
          'Social proof testimonials',
          'Feature highlights',
          'Pricing tables',
          'Contact forms',
          'Newsletter signup',
          'Mobile responsive',
          'Fast loading',
          'SEO optimized',
          'A/B testing ready'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
      {
        ownerId: adminUser._id,
        title: 'Modern Blog Platform',
        description: 'A feature-rich blog template with content management, author profiles, and social sharing. Perfect for content creators and media companies.',
        category: categoryMap.get('blog-news'),
        tags: [tagMap.get('nextjs'), tagMap.get('typescript'), tagMap.get('blog'), tagMap.get('responsive'), tagMap.get('dark-mode')],
        fileUrl: 'https://example.com/templates/modern-blog.zip',
        previewUrl: 'https://modern-blog-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/3183159/pexels-photo-3183159.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183160/pexels-photo-3183160.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183161/pexels-photo-3183161.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: personalLicense?._id,
        price: 59.99,
        downloads: 178,
        sales: 92,
        rating: 4.8,
        reviewCount: 28,
        features: [
          'Content management system',
          'Author profiles',
          'Category organization',
          'Search functionality',
          'Social sharing',
          'Comment system',
          'Newsletter integration',
          'SEO optimization',
          'RSS feeds',
          'Related posts'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
      {
        ownerId: adminUser._id,
        title: 'Corporate Business Site',
        description: 'A professional corporate website template with company information, team profiles, and service showcases. Ideal for businesses looking to establish a strong online presence.',
        category: categoryMap.get('corporate'),
        tags: [tagMap.get('react'), tagMap.get('tailwind'), tagMap.get('corporate-tag'), tagMap.get('responsive'), tagMap.get('modern')],
        fileUrl: 'https://example.com/templates/corporate-business.zip',
        previewUrl: 'https://corporate-business-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/3183162/pexels-photo-3183162.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183163/pexels-photo-3183163.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183164/pexels-photo-3183164.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: commercialLicense?._id,
        price: 79.99,
        downloads: 134,
        sales: 78,
        rating: 4.5,
        reviewCount: 19,
        features: [
          'Company overview pages',
          'Team member profiles',
          'Service showcases',
          'Contact information',
          'News/Updates section',
          'Client testimonials',
          'Call-to-action buttons',
          'Contact forms',
          'Google Maps integration',
          'Social media links'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
      {
        ownerId: adminUser._id,
        title: 'Restaurant & Food Delivery',
        description: 'A beautiful restaurant website template with menu display, online ordering, and reservation system. Perfect for restaurants and food delivery services.',
        category: categoryMap.get('restaurant-food'),
        tags: [tagMap.get('react'), tagMap.get('restaurant'), tagMap.get('responsive'), tagMap.get('animation'), tagMap.get('modern')],
        fileUrl: 'https://example.com/templates/restaurant-food.zip',
        previewUrl: 'https://restaurant-food-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183166/pexels-photo-3183166.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183167/pexels-photo-3183167.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: commercialLicense?._id,
        price: 69.99,
        downloads: 98,
        sales: 45,
        rating: 4.7,
        reviewCount: 15,
        features: [
          'Menu display system',
          'Online ordering',
          'Reservation booking',
          'Location information',
          'Opening hours',
          'Food gallery',
          'Customer reviews',
          'Contact forms',
          'Mobile responsive',
          'Delivery tracking'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
      {
        ownerId: adminUser._id,
        title: 'Real Estate Property Listings',
        description: 'A comprehensive real estate template with property search, detailed listings, and agent profiles. Built for real estate agencies and property managers.',
        category: categoryMap.get('real-estate'),
        tags: [tagMap.get('react'), tagMap.get('typescript'), tagMap.get('responsive'), tagMap.get('api'), tagMap.get('modern')],
        fileUrl: 'https://example.com/templates/real-estate.zip',
        previewUrl: 'https://real-estate-demo.codeskins.com',
        previewImages: [
          'https://images.pexels.com/photos/3183168/pexels-photo-3183168.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183169/pexels-photo-3183169.jpeg?w=1200&h=800&fit=crop',
          'https://images.pexels.com/photos/3183170/pexels-photo-3183170.jpeg?w=1200&h=800&fit=crop',
        ],
        isActive: true,
        licenseId: commercialLicense?._id,
        price: 99.99,
        downloads: 87,
        sales: 52,
        rating: 4.6,
        reviewCount: 12,
        features: [
          'Property search filters',
          'Detailed property listings',
          'Agent profiles',
          'Property galleries',
          'Contact forms',
          'Map integration',
          'Mortgage calculator',
          'Favorites system',
          'Email notifications',
          'Admin dashboard'
        ],
        status: 'active' as const,
        isAvailable: true,
        remainingSales: -1,
      },
    ];

    await Template.insertMany(templates);
    console.log(`✅ Created ${templates.length} templates successfully`);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    throw error;
  }
} 