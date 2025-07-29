import { Tag } from '../../models/Tag';

export async function seedTags() {
  try {
    // Check if tags already exist
    const existingTags = await Tag.countDocuments();
    if (existingTags > 0) {
      console.log('🏷️ Tags already exist, skipping tag seeding');
      return;
    }

    const tags = [
      // Technology tags
      { name: 'React', description: 'Built with React.js', slug: 'react', color: '#61dafb', isActive: true, templateCount: 0 },
      { name: 'Next.js', description: 'Next.js framework', slug: 'nextjs', color: '#000000', isActive: true, templateCount: 0 },
      { name: 'Vue.js', description: 'Vue.js framework', slug: 'vuejs', color: '#4fc08d', isActive: true, templateCount: 0 },
      { name: 'Angular', description: 'Angular framework', slug: 'angular', color: '#dd0031', isActive: true, templateCount: 0 },
      { name: 'TypeScript', description: 'TypeScript support', slug: 'typescript', color: '#3178c6', isActive: true, templateCount: 0 },
      { name: 'Tailwind CSS', description: 'Tailwind CSS styling', slug: 'tailwind', color: '#06b6d4', isActive: true, templateCount: 0 },
      
      // Design tags
      { name: 'Responsive', description: 'Fully responsive design', slug: 'responsive', color: '#10b981', isActive: true, templateCount: 0 },
      { name: 'Modern', description: 'Modern design aesthetic', slug: 'modern', color: '#8b5cf6', isActive: true, templateCount: 0 },
      { name: 'Minimal', description: 'Minimalist design', slug: 'minimal', color: '#6b7280', isActive: true, templateCount: 0 },
      { name: 'Dark Mode', description: 'Dark mode support', slug: 'dark-mode', color: '#1f2937', isActive: true, templateCount: 0 },
      { name: 'Animation', description: 'Smooth animations', slug: 'animation', color: '#f59e0b', isActive: true, templateCount: 0 },
      
      // Feature tags
      { name: 'E-commerce', description: 'E-commerce functionality', slug: 'ecommerce-feature', color: '#ef4444', isActive: true, templateCount: 0 },
      { name: 'Blog', description: 'Blog functionality', slug: 'blog', color: '#3b82f6', isActive: true, templateCount: 0 },
      { name: 'Dashboard', description: 'Admin dashboard', slug: 'dashboard', color: '#8b5cf6', isActive: true, templateCount: 0 },
      { name: 'Authentication', description: 'User authentication', slug: 'authentication', color: '#10b981', isActive: true, templateCount: 0 },
      { name: 'API', description: 'REST API included', slug: 'api', color: '#f97316', isActive: true, templateCount: 0 },
      
      // Industry tags
      { name: 'SaaS', description: 'SaaS application', slug: 'saas', color: '#6366f1', isActive: true, templateCount: 0 },
      { name: 'Portfolio', description: 'Portfolio website', slug: 'portfolio-tag', color: '#ec4899', isActive: true, templateCount: 0 },
      { name: 'Landing Page', description: 'Landing page template', slug: 'landing-page', color: '#06b6d4', isActive: true, templateCount: 0 },
      { name: 'Corporate', description: 'Corporate website', slug: 'corporate-tag', color: '#374151', isActive: true, templateCount: 0 },
      { name: 'Restaurant', description: 'Restaurant website', slug: 'restaurant', color: '#f59e0b', isActive: true, templateCount: 0 },
    ];

    await Tag.insertMany(tags);
    console.log(`✅ Created ${tags.length} tags successfully`);
  } catch (error) {
    console.error('❌ Error seeding tags:', error);
    throw error;
  }
} 