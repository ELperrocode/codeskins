import { License } from '../../models/License';

export async function seedLicenses() {
  try {
    // Check if licenses already exist
    const existingLicenses = await License.countDocuments();
    if (existingLicenses > 0) {
      console.log('📄 Licenses already exist, skipping license seeding');
      return;
    }

    const licenses = [
      {
        name: 'Personal License',
        description: 'For personal projects and learning. Single use, no commercial rights.',
        price: 29.99,
        maxSales: -1, // Unlimited
        isActive: true,
      },
      {
        name: 'Commercial License',
        description: 'For commercial projects and client work. Multiple uses allowed.',
        price: 79.99,
        maxSales: -1, // Unlimited
        isActive: true,
      },
      {
        name: 'Agency License',
        description: 'For agencies and freelancers. Unlimited projects and client work.',
        price: 199.99,
        maxSales: -1, // Unlimited
        isActive: true,
      },
      {
        name: 'Extended License',
        description: 'For resale and white-label products. Full commercial rights.',
        price: 399.99,
        maxSales: -1, // Unlimited
        isActive: true,
      },
      {
        name: 'Enterprise License',
        description: 'For large organizations. Custom terms and support included.',
        price: 999.99,
        maxSales: -1, // Unlimited
        isActive: true,
      },
    ];

    await License.insertMany(licenses);
    console.log(`✅ Created ${licenses.length} licenses successfully`);
  } catch (error) {
    console.error('❌ Error seeding licenses:', error);
    throw error;
  }
} 