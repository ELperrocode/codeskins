const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeskins');

// Import Template model
const { Template } = require('../src/models/Template');

async function updateTemplateFiles() {
  try {
    console.log('Updating template file URLs...');

    // Update Photography Studio template
    await Template.findByIdAndUpdate('687aeffc41ae1f1165071489', {
      fileUrl: 'photography-studio-template.zip'
    });
    console.log('✅ Updated Photography Studio template');

    // Update Blog & Magazine template
    await Template.findByIdAndUpdate('687aeffc41ae1f1165071486', {
      fileUrl: 'blog-magazine-template.zip'
    });
    console.log('✅ Updated Blog & Magazine template');

    // Update other templates with placeholder files
    const otherTemplates = [
      '687aeffc41ae1f1165071483', // Startup Landing Page
      '687aeffc41ae1f1165071480', // Creative Agency
      '687aeffc41ae1f116507147d', // Restaurant & Food
      '687aeffc41ae1f116507147a', // Corporate Business Site
      '687aeffc41ae1f1165071477', // Portfolio Showcase
      '687aeffc41ae1f1165071474'  // Modern E-commerce Template
    ];

    for (const templateId of otherTemplates) {
      await Template.findByIdAndUpdate(templateId, {
        fileUrl: 'template-file.zip'
      });
    }
    console.log('✅ Updated other templates');

    console.log('🎉 All template file URLs updated successfully!');
  } catch (error) {
    console.error('❌ Error updating templates:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateTemplateFiles(); 