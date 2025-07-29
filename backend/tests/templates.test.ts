import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { build } from '../src/server';
import { User } from '../src/models/User';
import { Template } from '../src/models/Template';
import { License } from '../src/models/License';

describe('Template Endpoints', () => {
  let app: FastifyInstance;
  let agent: any;
  let sellerAgent: any;
  let customerAgent: any;
  let sellerUser: any;
  let testLicense: any;

  beforeAll(async () => {
    app = await build();
    await app.ready();
    agent = request.agent(app.server);
    sellerAgent = request.agent(app.server);
    customerAgent = request.agent(app.server);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Create test users with unique data
    sellerUser = await User.create({
      username: 'seller2',
      email: 'seller2@example.com',
      password: 'password123',
      role: 'seller',
      isActive: true,
    });

    await User.create({
      username: 'customer2',
      email: 'customer2@example.com',
      password: 'password123',
      role: 'customer',
      isActive: true,
    });

    // Create test license
    testLicense = await License.create({
      name: 'Test License Type',
      description: 'A test license type',
      price: 19.99,
      maxDownloads: 1,
      isActive: true,
    });

    // Login users
    await sellerAgent.post('/api/auth/login').send({
      username: 'seller2',
      password: 'password123',
    });

    await customerAgent.post('/api/auth/login').send({
      username: 'customer2',
      password: 'password123',
    });
  });

  describe('GET /api/templates', () => {
    beforeEach(async () => {
      // Create test templates
      await Template.create([
        {
          sellerId: sellerUser._id,
          title: 'Landing Page Template',
          description: 'A beautiful landing page template',
          licenseId: testLicense._id,
          price: 29.99,
          maxDownloads: 1,
          category: 'landing-page',
          tags: ['landing', 'responsive'],
          isActive: true,
          fileUrl: '/uploads/landing.zip',
        },
        {
          sellerId: sellerUser._id,
          title: 'E-commerce Template',
          description: 'Complete e-commerce solution',
          licenseId: testLicense._id,
          price: 49.99,
          maxDownloads: 5,
          category: 'ecommerce',
          tags: ['ecommerce', 'shop'],
          isActive: true,
          fileUrl: '/uploads/ecommerce.zip',
        },
      ]);
    });

    it('should get all active templates', async () => {
      const response = await agent.get('/api/templates').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.templates).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.templates[0].licenseId).toBeDefined();
    });

    it('should filter templates by category', async () => {
      const response = await agent
        .get('/api/templates?category=landing-page')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.templates).toHaveLength(1);
      expect(response.body.data.templates[0].category).toBe('landing-page');
    });

    it('should filter templates by price range', async () => {
      const response = await agent
        .get('/api/templates?minPrice=30&maxPrice=60')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.templates).toHaveLength(1);
      expect(response.body.data.templates[0].price).toBe(49.99);
    });

    it('should search templates by text', async () => {
      const response = await agent
        .get('/api/templates?search=landing')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.templates).toHaveLength(1);
      expect(response.body.data.templates[0].title).toContain('Landing');
    });
  });

  describe('GET /api/templates/:id', () => {
    let template: any;

    beforeEach(async () => {
      template = await Template.create({
        sellerId: sellerUser._id,
        title: 'Test Template',
        description: 'Test description',
        licenseId: testLicense._id,
        price: 19.99,
        maxDownloads: 1,
        category: 'landing-page',
        tags: ['test'],
        isActive: true,
        fileUrl: '/uploads/test.zip',
      });
    });

    it('should get a single template', async () => {
      const response = await agent.get(`/api/templates/${template._id}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.template.title).toBe('Test Template');
      expect(response.body.data.template.sellerId.username).toBe('seller2');
      expect(response.body.data.template.licenseId).toBeDefined();
    });

    it('should return 404 for non-existent template', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await agent.get(`/api/templates/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Template not found');
    });

    it('should return 404 for inactive template', async () => {
      await Template.findByIdAndUpdate(template._id, { isActive: false });
      
      const response = await agent.get(`/api/templates/${template._id}`).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Template not found');
    });
  });

  describe('POST /api/templates', () => {
    it('should create a template for authenticated seller', async () => {
      const templateData = {
        title: 'New Template',
        description: 'A new template description',
        licenseId: testLicense._id.toString(),
        price: 25.99,
        maxDownloads: 1,
        category: 'portfolio',
        tags: ['portfolio', 'modern'],
        fileUrl: '/uploads/new-template.zip',
      };

      const response = await sellerAgent
        .post('/api/templates')
        .send(templateData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Template created successfully');
      expect(response.body.data.template.title).toBe('New Template');
      expect(response.body.data.template.sellerId).toBe(sellerUser._id.toString());
      expect(response.body.data.template.licenseId).toBeDefined();
    });

    it('should not allow customer to create template', async () => {
      const templateData = {
        title: 'Customer Template',
        description: 'A template by customer',
        licenseId: testLicense._id.toString(),
        price: 15.99,
        maxDownloads: 1,
        category: 'blog',
        fileUrl: '/uploads/customer-template.zip',
      };

      const response = await customerAgent
        .post('/api/templates')
        .send(templateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only sellers can create templates');
    });

    it('should validate required fields', async () => {
      const response = await sellerAgent
        .post('/api/templates')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should validate price minimum', async () => {
      const templateData = {
        title: 'Invalid Template',
        description: 'A template with invalid price',
        licenseId: testLicense._id.toString(),
        price: -10,
        maxDownloads: 1,
        category: 'landing-page',
        fileUrl: '/uploads/invalid.zip',
      };

      const response = await sellerAgent
        .post('/api/templates')
        .send(templateData)
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should validate maxDownloads minimum', async () => {
      const templateData = {
        title: 'Invalid Template',
        description: 'A template with invalid maxDownloads',
        licenseId: testLicense._id.toString(),
        price: 19.99,
        maxDownloads: -5, // Invalid: less than -1
        category: 'landing-page',
        fileUrl: '/uploads/invalid.zip',
      };

      const response = await sellerAgent
        .post('/api/templates')
        .send(templateData)
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should allow unlimited downloads (-1)', async () => {
      const templateData = {
        title: 'Unlimited Template',
        description: 'A template with unlimited downloads',
        licenseId: testLicense._id.toString(),
        price: 99.99,
        maxDownloads: -1, // Unlimited
        category: 'landing-page',
        fileUrl: '/uploads/unlimited.zip',
      };

      const response = await sellerAgent
        .post('/api/templates')
        .send(templateData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.template.maxDownloads).toBe(-1);
    });

    it('should reject invalid license ID', async () => {
      const templateData = {
        title: 'Invalid License Template',
        description: 'A template with invalid license',
        licenseId: '507f1f77bcf86cd799439011', // Fake ID
        price: 19.99,
        maxDownloads: 1,
        category: 'landing-page',
        fileUrl: '/uploads/invalid-license.zip',
      };

      const response = await sellerAgent
        .post('/api/templates')
        .send(templateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid license type');
    });
  });

  describe('PUT /api/templates/:id', () => {
    let template: any;

    beforeEach(async () => {
      template = await Template.create({
        sellerId: sellerUser._id,
        title: 'Original Template',
        description: 'Original description',
        licenseId: testLicense._id,
        price: 19.99,
        maxDownloads: 1,
        category: 'landing-page',
        tags: ['original'],
        isActive: true,
        fileUrl: '/uploads/original.zip',
      });
    });

    it('should update template for owner', async () => {
      const updateData = {
        title: 'Updated Template',
        price: 29.99,
        maxDownloads: 5,
      };

      const response = await sellerAgent
        .put(`/api/templates/${template._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Template updated successfully');
      expect(response.body.data.template.title).toBe('Updated Template');
      expect(response.body.data.template.price).toBe(29.99);
      expect(response.body.data.template.maxDownloads).toBe(5);
    });

    it('should not allow non-owner to update template', async () => {
      const updateData = {
        title: 'Hacked Template',
      };

      const response = await customerAgent
        .put(`/api/templates/${template._id}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only edit your own templates');
    });

    it('should return 404 for non-existent template', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await sellerAgent
        .put(`/api/templates/${fakeId}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Template not found');
    });

    it('should validate license when updating', async () => {
      const updateData = {
        licenseId: '507f1f77bcf86cd799439011', // Fake ID
      };

      const response = await sellerAgent
        .put(`/api/templates/${template._id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid license type');
    });
  });

  describe('DELETE /api/templates/:id', () => {
    let template: any;

    beforeEach(async () => {
      template = await Template.create({
        sellerId: sellerUser._id,
        title: 'Template to Delete',
        description: 'This will be deleted',
        licenseId: testLicense._id,
        price: 19.99,
        maxDownloads: 1,
        category: 'landing-page',
        tags: ['delete'],
        isActive: true,
        fileUrl: '/uploads/delete.zip',
      });
    });

    it('should delete template for owner', async () => {
      const response = await sellerAgent
        .delete(`/api/templates/${template._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Template deleted successfully');

      // Verify template is deleted
      const deletedTemplate = await Template.findById(template._id);
      expect(deletedTemplate).toBeNull();
    });

    it('should not allow non-owner to delete template', async () => {
      const response = await customerAgent
        .delete(`/api/templates/${template._id}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only delete your own templates');
    });

    it('should return 404 for non-existent template', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await sellerAgent
        .delete(`/api/templates/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Template not found');
    });
  });

  describe('GET /api/templates/my-templates', () => {
    beforeEach(async () => {
      await Template.create([
        {
          sellerId: sellerUser._id,
          title: 'Seller Template 1',
          description: 'First template',
          licenseId: testLicense._id,
          price: 19.99,
          maxDownloads: 1,
          category: 'landing-page',
          isActive: true,
          fileUrl: '/uploads/seller1.zip',
        },
        {
          sellerId: sellerUser._id,
          title: 'Seller Template 2',
          description: 'Second template',
          licenseId: testLicense._id,
          price: 29.99,
          maxDownloads: 5,
          category: 'ecommerce',
          isActive: false,
          fileUrl: '/uploads/seller2.zip',
        },
      ]);
    });

    it('should get seller templates', async () => {
      const response = await sellerAgent.get('/api/templates/my-templates').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.templates).toHaveLength(2);
      expect(response.body.data.templates[0].sellerId).toBe(sellerUser._id.toString());
      expect(response.body.data.templates[0].licenseId).toBeDefined();
    });

    it('should not allow customer to access my-templates', async () => {
      const response = await customerAgent
        .get('/api/templates/my-templates')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only sellers can view their templates');
    });
  });
}); 