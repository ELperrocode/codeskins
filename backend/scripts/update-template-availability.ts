import mongoose from 'mongoose';
import { Template } from '../src/models/Template';
// Import for mongoose registration (unused but needed)
import '../src/models/License';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env['MONGODB_URI'] || 'mongodb://localhost:27017/codeskins');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function updateTemplateAvailability() {
  try {
    await connectDB();

    console.log('Starting to update template availability...');

    // Get all active templates with their license info
    const templates = await Template.find({ isActive: true, status: 'active' })
      .populate('licenseId', 'maxSales');

    console.log(`Found ${templates.length} active templates`);

    let deactivatedCount = 0;
    let updatedCount = 0;

    for (const template of templates) {
      const license = template.licenseId as any;
      
      if (license && license.maxSales && license.maxSales > 0) {
        const remainingSales = license.maxSales - template.sales;
        
        if (remainingSales <= 0) {
          // Template has reached its sales limit, deactivate it
          await Template.findByIdAndUpdate(template._id, {
            isActive: false,
            status: 'inactive'
          });
          
          console.log(`❌ Deactivated template "${template.title}" - Sales limit reached (${template.sales}/${license.maxSales})`);
          deactivatedCount++;
        } else {
          console.log(`✅ Template "${template.title}" - ${remainingSales} sales remaining (${template.sales}/${license.maxSales})`);
          updatedCount++;
        }
      } else {
        // No sales limit, template is unlimited
        console.log(`♾️ Template "${template.title}" - Unlimited sales (${template.sales} sold)`);
        updatedCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  - Templates deactivated: ${deactivatedCount}`);
    console.log(`  - Templates still available: ${updatedCount}`);
    console.log(`  - Total processed: ${templates.length}`);

    // Show final stats
    const finalStats = await Template.aggregate([
      {
        $lookup: {
          from: 'licenses',
          localField: 'licenseId',
          foreignField: '_id',
          as: 'license'
        }
      },
      {
        $unwind: '$license'
      },
      {
        $group: {
          _id: null,
          totalTemplates: { $sum: 1 },
          activeTemplates: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$isActive', true] }, { $eq: ['$status', 'active'] }] },
                1,
                0
              ]
            }
          },
          limitedTemplates: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ['$license.maxSales', 0] }] },
                1,
                0
              ]
            }
          },
          unlimitedTemplates: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$license.maxSales', -1] }, { $eq: ['$license.maxSales', null] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    if (finalStats.length > 0) {
      const stats = finalStats[0];
      console.log('\n📈 Final Statistics:');
      console.log(`  - Total templates: ${stats.totalTemplates}`);
      console.log(`  - Active templates: ${stats.activeTemplates}`);
      console.log(`  - Limited sales templates: ${stats.limitedTemplates}`);
      console.log(`  - Unlimited sales templates: ${stats.unlimitedTemplates}`);
    }

  } catch (error) {
    console.error('❌ Error updating template availability:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the script
updateTemplateAvailability(); 