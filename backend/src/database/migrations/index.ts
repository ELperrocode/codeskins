import { connectDatabase } from '../../config/database';
import { seedUsers } from './001-seed-users';
import { seedCategories } from './002-seed-categories';
import { seedTags } from './003-seed-tags';
import { seedLicenses } from './004-seed-licenses';
import { seedTemplates } from './005-seed-templates';
import { seedReviews } from './006-seed-reviews';

export async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Connect to database
    await connectDatabase();
    
    // Run migrations in order
    console.log('📝 Running migration: Seed Users');
    await seedUsers();
    
    console.log('📝 Running migration: Seed Categories');
    await seedCategories();
    
    console.log('📝 Running migration: Seed Tags');
    await seedTags();
    
    console.log('📝 Running migration: Seed Licenses');
    await seedLicenses();
    
    console.log('📝 Running migration: Seed Templates');
    await seedTemplates();
    
    console.log('📝 Running migration: Seed Reviews');
    await seedReviews();
    
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
} 