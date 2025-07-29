# Database Migrations & Seeders

This directory contains the database migration and seeding system for CodeSkins.

## Overview

The migration system creates realistic, production-ready data for the CodeSkins marketplace, including:

- **Users**: Admin and customer accounts with realistic profiles
- **Categories**: Web design categories with high-quality images
- **Tags**: Technology and design tags for template classification
- **Licenses**: Various license types with realistic pricing
- **Templates**: Professional web templates with detailed features
- **Reviews**: Authentic customer reviews and ratings

## Migration Files

### 001-seed-users.ts
Creates admin and customer users with realistic profiles:
- 3 admin users (CodeSkins team)
  - admin@codeskins.com (password: password123)
  - admin123@codeskins.com (password: admin123)
  - sarah@codeskins.com (password: password123)
- 8 customer users (realistic personas from different companies)
- All users have password: `password123` (except admin123)

### 002-seed-categories.ts
Creates 10 web design categories:
- E-commerce, Portfolio, SaaS & Apps, Landing Pages
- Blog & News, Corporate, Restaurant & Food
- Real Estate, Education, Healthcare
- Each category has a high-quality Pexels image

### 003-seed-tags.ts
Creates 20 relevant tags:
- Technology: React, Next.js, Vue.js, Angular, TypeScript, Tailwind CSS
- Design: Responsive, Modern, Minimal, Dark Mode, Animation
- Features: E-commerce, Blog, Dashboard, Authentication, API
- Industry: SaaS, Portfolio, Landing Page, Corporate, Restaurant

### 004-seed-licenses.ts
Creates 5 license types:
- Personal License ($29.99)
- Commercial License ($79.99)
- Agency License ($199.99)
- Extended License ($399.99)
- Enterprise License ($999.99)

### 005-seed-templates.ts
Creates 8 professional templates:
- Elegant E-commerce Store ($89.99)
- Creative Portfolio Pro ($49.99)
- SaaS Dashboard ($129.99)
- High-Converting Landing Page ($39.99)
- Modern Blog Platform ($59.99)
- Corporate Business Site ($79.99)
- Restaurant & Food Delivery ($69.99)
- Real Estate Property Listings ($99.99)

Each template includes:
- Detailed descriptions
- Multiple high-quality preview images (website screenshots)
- Comprehensive feature lists
- Realistic pricing and metrics
- Proper categorization and tagging

### 006-seed-reviews.ts
Creates authentic customer reviews:
- 15 detailed reviews across all templates
- Realistic ratings (4-5 stars)
- Authentic comments from different user personas
- Verified purchase status

## Usage

### Run All Migrations
```bash
npm run seed
```

### Run Individual Migrations
```bash
# Seed users only
npm run seed:users

# Seed categories only
npm run seed:categories

# Seed tags only
npm run seed:tags

# Seed licenses only
npm run seed:licenses

# Seed templates only
npm run seed:templates

# Seed reviews only
npm run seed:reviews
```

## Data Quality

### Images
- All images are from Pexels (high-quality, free-to-use)
- Minimalist and modern design aesthetic
- Website screenshots and professional layouts
- Optimized for web with proper dimensions
- Relevant to each category/template

### User Data
- Realistic email addresses and company names
- Diverse geographic locations
- Professional usernames and profiles

### Template Features
- Detailed, realistic feature lists
- Industry-specific functionality
- Modern web development technologies

### Reviews
- Authentic-sounding customer feedback
- Specific feature mentions
- Realistic use cases and outcomes

## Safety Features

- **Idempotent**: Running migrations multiple times won't create duplicates
- **Dependency Management**: Migrations run in the correct order
- **Error Handling**: Comprehensive error handling and logging
- **Data Validation**: All data is validated before insertion

## Customization

To add new data or modify existing data:

1. Edit the appropriate migration file
2. Add new data to the arrays
3. Run the specific migration: `npm run seed:filename`

## Notes

- All passwords are hashed using bcrypt
- Images are served from Pexels CDN
- Template files are placeholder URLs
- Reviews are marked as verified purchases
- All data is production-ready and realistic 