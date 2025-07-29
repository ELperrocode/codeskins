import bcrypt from 'bcryptjs';
import { User } from '../../models/User';

export async function seedUsers() {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('👥 Users already exist, skipping user seeding');
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = [
      // Admin users
      {
        username: 'admin',
        email: 'admin@codeskins.com',
        password: hashedPassword,
        role: 'admin' as const,
        firstName: 'Alex',
        lastName: 'Johnson',
        isActive: true,
        status: 'active' as const,
      },
      {
        username: 'admin123',
        email: 'admin123@codeskins.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin' as const,
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        status: 'active' as const,
      },
      {
        username: 'sarah_admin',
        email: 'sarah@codeskins.com',
        password: hashedPassword,
        role: 'admin' as const,
        firstName: 'Sarah',
        lastName: 'Chen',
        isActive: true,
        status: 'active' as const,
      },
      
      // Customer users with realistic data
      {
        username: 'marcus_dev',
        email: 'marcus.rodriguez@techcorp.com',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'Marcus',
        lastName: 'Rodriguez',
        isActive: true,
        status: 'active' as const,
        phone: '+1-555-0123',
        country: 'United States',
      },
      {
        username: 'emily_founder',
        email: 'emily@innovatelab.io',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'Emily',
        lastName: 'Watson',
        isActive: true,
        status: 'active' as const,
        phone: '+1-555-0456',
        country: 'Canada',
      },
      {
        username: 'david_fullstack',
        email: 'david.kim@digitalagency.com',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'David',
        lastName: 'Kim',
        isActive: true,
        status: 'active' as const,
        phone: '+1-555-0789',
        country: 'United States',
      },
      {
        username: 'lisa_pm',
        email: 'lisa.thompson@saasstartup.com',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'Lisa',
        lastName: 'Thompson',
        isActive: true,
        status: 'active' as const,
        phone: '+1-555-0321',
        country: 'United Kingdom',
      },
      {
        username: 'alex_designer',
        email: 'alex.johnson@designstudio.com',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'Alex',
        lastName: 'Johnson',
        isActive: true,
        status: 'active' as const,
        phone: '+1-555-0654',
        country: 'Australia',
      },
      {
        username: 'carlos_dev',
        email: 'carlos.garcia@startup.com',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'Carlos',
        lastName: 'Garcia',
        isActive: true,
        status: 'active' as const,
        phone: '+34-555-0987',
        country: 'Spain',
      },
      {
        username: 'anna_ux',
        email: 'anna.smith@creativeagency.com',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'Anna',
        lastName: 'Smith',
        isActive: true,
        status: 'active' as const,
        phone: '+44-555-0123',
        country: 'United Kingdom',
      },
      {
        username: 'mike_developer',
        email: 'mike.wilson@techstartup.com',
        password: hashedPassword,
        role: 'customer' as const,
        firstName: 'Mike',
        lastName: 'Wilson',
        isActive: true,
        status: 'active' as const,
        phone: '+1-555-0456',
        country: 'United States',
      },
    ];

    await User.insertMany(users);
    console.log(`✅ Created ${users.length} users successfully`);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
} 