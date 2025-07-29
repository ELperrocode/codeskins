import { Review } from '../../models/Review';
import { User } from '../../models/User';
import { Template } from '../../models/Template';

export async function seedReviews() {
  try {
    // Check if reviews already exist
    const existingReviews = await Review.countDocuments();
    if (existingReviews > 0) {
      console.log('⭐ Reviews already exist, skipping review seeding');
      return;
    }

    // Get customer users
    const customers = await User.find({ role: 'customer' });
    if (customers.length === 0) {
      console.log('👥 No customer users found, skipping review seeding');
      return;
    }

    // Get templates
    const templates = await Template.find({ isActive: true });
    if (templates.length === 0) {
      console.log('🎨 No templates found, skipping review seeding');
      return;
    }

    const reviews = [
      // Reviews for Elegant E-commerce Store
      {
        userId: customers[0]._id,
        templateId: templates[0]._id,
        rating: 5,
        title: 'Exceptional E-commerce Template',
        comment: 'This template exceeded all my expectations! The product filtering is incredibly smooth, and the checkout process is optimized for conversions. The admin dashboard is intuitive and has everything I need to manage my store. Highly recommended for anyone serious about e-commerce.',
        isVerified: true,
        isActive: true,
      },
      {
        userId: customers[1]._id,
        templateId: templates[0]._id,
        rating: 4,
        title: 'Great Foundation for Online Store',
        comment: 'Solid e-commerce template with all the essential features. The responsive design works perfectly on mobile devices. The only minor issue is that some customizations require a bit more coding knowledge, but overall it\'s excellent value for money.',
        isVerified: true,
        isActive: true,
      },
      {
        userId: customers[2]._id,
        templateId: templates[0]._id,
        rating: 5,
        title: 'Perfect for My Fashion Store',
        comment: 'I used this template for my fashion boutique and it\'s been amazing! The product grid showcases my items beautifully, and customers love the smooth shopping experience. The wishlist feature has increased my sales significantly.',
        isVerified: true,
        isActive: true,
      },

      // Reviews for Creative Portfolio Pro
      {
        userId: customers[3]._id,
        templateId: templates[1]._id,
        rating: 5,
        title: 'Stunning Portfolio Design',
        comment: 'As a graphic designer, I needed a portfolio that would make my work stand out. This template does exactly that! The animations are smooth and professional, and the project showcase feature is perfect for displaying my work. My clients are always impressed.',
        isVerified: true,
        isActive: true,
      },
      {
        userId: customers[4]._id,
        templateId: templates[1]._id,
        rating: 5,
        title: 'Best Portfolio Template I\'ve Used',
        comment: 'The dark/light mode toggle is a game-changer, and the contact form integration works flawlessly. The SEO optimization helped me rank better on Google. This template helped me land several new clients!',
        isVerified: true,
        isActive: true,
      },

      // Reviews for SaaS Dashboard
      {
        userId: customers[5]._id,
        templateId: templates[2]._id,
        rating: 4,
        title: 'Comprehensive SaaS Solution',
        comment: 'This dashboard template has everything we needed for our SaaS application. The user management system is robust, and the analytics integration is spot-on. The subscription handling saved us weeks of development time.',
        isVerified: true,
        isActive: true,
      },
      {
        userId: customers[6]._id,
        templateId: templates[2]._id,
        rating: 5,
        title: 'Enterprise-Grade Dashboard',
        comment: 'We implemented this for our enterprise SaaS and it\'s been fantastic. The role-based access control is exactly what we needed, and the real-time notifications work perfectly. The API documentation is comprehensive and well-written.',
        isVerified: true,
        isActive: true,
      },

      // Reviews for High-Converting Landing Page
      {
        userId: customers[7]._id,
        templateId: templates[3]._id,
        rating: 5,
        title: 'Conversion Rate Increased by 40%',
        comment: 'This landing page template is a conversion machine! The social proof testimonials and optimized forms helped us increase our conversion rate by 40%. The A/B testing capabilities are excellent for optimization.',
        isVerified: true,
        isActive: true,
      },
      {
        userId: customers[0]._id,
        templateId: templates[3]._id,
        rating: 4,
        title: 'Great for Marketing Campaigns',
        comment: 'Used this for our product launch and it performed exceptionally well. The hero section with CTA is perfectly designed, and the pricing tables are conversion-optimized. Mobile responsiveness is flawless.',
        isVerified: true,
        isActive: true,
      },

      // Reviews for Modern Blog Platform
      {
        userId: customers[1]._id,
        templateId: templates[4]._id,
        rating: 5,
        title: 'Perfect for Content Creators',
        comment: 'As a content creator, I needed a blog that could handle high traffic and multiple authors. This template delivers! The content management system is intuitive, and the social sharing features are excellent.',
        isVerified: true,
        isActive: true,
      },
      {
        userId: customers[2]._id,
        templateId: templates[4]._id,
        rating: 4,
        title: 'Excellent Blog Template',
        comment: 'The author profiles and category organization are well thought out. The search functionality is fast and accurate. The dark mode support is a nice touch that our readers love.',
        isVerified: true,
        isActive: true,
      },

      // Reviews for Corporate Business Site
      {
        userId: customers[3]._id,
        templateId: templates[5]._id,
        rating: 4,
        title: 'Professional Corporate Look',
        comment: 'This template gave our company a professional online presence. The team member profiles and service showcases are well-designed. The Google Maps integration works perfectly for our contact page.',
        isVerified: true,
        isActive: true,
      },

      // Reviews for Restaurant & Food Delivery
      {
        userId: customers[4]._id,
        templateId: templates[6]._id,
        rating: 5,
        title: 'Perfect for Our Restaurant',
        comment: 'Our restaurant website looks amazing with this template! The menu display system is beautiful, and the online ordering integration was seamless. Customers love the food gallery and reservation system.',
        isVerified: true,
        isActive: true,
      },

      // Reviews for Real Estate Property Listings
      {
        userId: customers[5]._id,
        templateId: templates[7]._id,
        rating: 4,
        title: 'Comprehensive Real Estate Solution',
        comment: 'This template has everything a real estate agency needs. The property search filters are powerful, and the agent profiles look professional. The mortgage calculator is a great addition that clients appreciate.',
        isVerified: true,
        isActive: true,
      },
    ];

    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviews.length} reviews successfully`);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    throw error;
  }
} 