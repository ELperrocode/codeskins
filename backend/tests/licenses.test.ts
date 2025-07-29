import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { build } from '../src/server';
import { User } from '../src/models/User';
import { License } from '../src/models/License';

describe('License Endpoints', () => {
  let app: FastifyInstance;
  let agent: any;
  let adminAgent: any;
  let sellerAgent: any;
  let customerAgent: any;

  beforeAll(async () => {
    app = await build();
    await app.ready();
    agent = request.agent(app.server);
    adminAgent = request.agent(app.server);
    sellerAgent = request.agent(app.server);
    customerAgent = request.agent(app.server);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Create test users with unique data
    await User.create({
      username: 'admin1',
      email: 'admin1@example.com',
      password: 'password123',
      role: 'admin',
      isActive: true,
    });

    await User.create({
      username: 'seller1',
      email: 'seller1@example.com',
      password: 'password123',
      role: 'seller',
      isActive: true,
    });

    await User.create({
      username: 'customer1',
      email: 'customer1@example.com',
      password: 'password123',
      role: 'customer',
      isActive: true,
    });

    // Login users
    await adminAgent.post('/api/auth/login').send({
      username: 'admin1',
      password: 'password123',
    });

    await sellerAgent.post('/api/auth/login').send({
      username: 'seller1',
      password: 'password123',
    });

    await customerAgent.post('/api/auth/login').send({
      username: 'customer1',
      password: 'password123',
    });
  });

  describe('GET /api/licenses', () => {
    beforeEach(async () => {
      // Create test license types
      await License.create([
        {
          name: 'Personal License',
          description: 'For personal use only',
          price: 19.99,
          maxDownloads: 1,
          isActive: true,
        },
        {
          name: 'Commercial License',
          description: 'For commercial use',
          price: 49.99,
          maxDownloads: 5,
          isActive: true,
        },
        {
          name: 'Unlimited License',
          description: 'Unlimited use and downloads',
          price: 99.99,
          maxDownloads: -1,
          isActive: false, // Inactive license
        },
      ]);
    });

    it('should get all active license types', async () => {
      const response = await agent
        .get('/api/licenses')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.licenses).toHaveLength(2); // Only active ones
      expect(response.body.data.licenses[0].name).toBe('Personal License');
      expect(response.body.data.licenses[1].name).toBe('Commercial License');
    });

    it('should sort licenses by price', async () => {
      const response = await agent
        .get('/api/licenses')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.licenses[0].price).toBe(19.99); // Personal
      expect(response.body.data.licenses[1].price).toBe(49.99); // Commercial
    });
  });

  describe('GET /api/licenses/:id', () => {
    let license: any;

    beforeEach(async () => {
      license = await License.create({
        name: 'Test License Type',
        description: 'A test license type',
        price: 29.99,
        maxDownloads: 3,
        isActive: true,
      });
    });

    it('should get a single license type', async () => {
      const response = await agent
        .get(`/api/licenses/${license._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.license.name).toBe('Test License Type');
      expect(response.body.data.license.maxDownloads).toBe(3);
    });

    it('should return 404 for non-existent license', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await agent
        .get(`/api/licenses/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('License not found');
    });

    it('should return 404 for inactive license', async () => {
      await License.findByIdAndUpdate(license._id, { isActive: false });
      
      const response = await agent
        .get(`/api/licenses/${license._id}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('License not found');
    });
  });

  describe('POST /api/licenses', () => {
    it('should create a license type for admin', async () => {
      const licenseData = {
        name: 'New License Type',
        description: 'A new license type for testing',
        price: 39.99,
        maxDownloads: 10,
      };

      const response = await adminAgent
        .post('/api/licenses')
        .send(licenseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('License type created successfully');
      expect(response.body.data.license.name).toBe('New License Type');
      expect(response.body.data.license.maxDownloads).toBe(10);
    });

    it('should not allow seller to create license type', async () => {
      const licenseData = {
        name: 'Seller License',
        description: 'A license by seller',
        price: 15.99,
        maxDownloads: 1,
      };

      const response = await sellerAgent
        .post('/api/licenses')
        .send(licenseData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only admins can create license types');
    });

    it('should not allow customer to create license type', async () => {
      const licenseData = {
        name: 'Customer License',
        description: 'A license by customer',
        price: 15.99,
        maxDownloads: 1,
      };

      const response = await customerAgent
        .post('/api/licenses')
        .send(licenseData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only admins can create license types');
    });

    it('should validate required fields', async () => {
      const response = await adminAgent
        .post('/api/licenses')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should validate maxDownloads minimum', async () => {
      const licenseData = {
        name: 'Invalid License',
        description: 'A license with invalid maxDownloads',
        price: 19.99,
        maxDownloads: -5, // Invalid: less than -1
      };

      const response = await adminAgent
        .post('/api/licenses')
        .send(licenseData)
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should allow unlimited downloads (-1)', async () => {
      const licenseData = {
        name: 'Unlimited License Type',
        description: 'Unlimited downloads license',
        price: 99.99,
        maxDownloads: -1, // Unlimited
      };

      const response = await adminAgent
        .post('/api/licenses')
        .send(licenseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.license.maxDownloads).toBe(-1);
    });

    it('should not allow duplicate license names', async () => {
      // Create first license
      await License.create({
        name: 'Duplicate License',
        description: 'First license',
        price: 19.99,
        maxDownloads: 1,
      });

      // Try to create second with same name
      const licenseData = {
        name: 'Duplicate License',
        description: 'Second license with same name',
        price: 29.99,
        maxDownloads: 2,
      };

      const response = await adminAgent
        .post('/api/licenses')
        .send(licenseData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('License type with this name already exists');
    });
  });

  describe('PUT /api/licenses/:id', () => {
    let license: any;

    beforeEach(async () => {
      license = await License.create({
        name: 'Original License Type',
        description: 'Original description',
        price: 19.99,
        maxDownloads: 1,
        isActive: true,
      });
    });

    it('should update license type for admin', async () => {
      const updateData = {
        name: 'Updated License Type',
        price: 29.99,
        maxDownloads: 5,
      };

      const response = await adminAgent
        .put(`/api/licenses/${license._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('License type updated successfully');
      expect(response.body.data.license.name).toBe('Updated License Type');
      expect(response.body.data.license.maxDownloads).toBe(5);
    });

    it('should not allow seller to update license type', async () => {
      const updateData = {
        name: 'Hacked License',
      };

      const response = await sellerAgent
        .put(`/api/licenses/${license._id}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only admins can update license types');
    });

    it('should not allow customer to update license type', async () => {
      const updateData = {
        name: 'Hacked License',
      };

      const response = await customerAgent
        .put(`/api/licenses/${license._id}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only admins can update license types');
    });

    it('should return 404 for non-existent license', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await adminAgent
        .put(`/api/licenses/${fakeId}`)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('License not found');
    });

    it('should not allow duplicate names when updating', async () => {
      // Create another license
      await License.create({
        name: 'Another License Type',
        description: 'Another license',
        price: 29.99,
        maxDownloads: 2,
      });

      // Try to update first license with same name
      const response = await adminAgent
        .put(`/api/licenses/${license._id}`)
        .send({ name: 'Another License Type' })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('License type with this name already exists');
    });
  });

  describe('DELETE /api/licenses/:id', () => {
    let license: any;

    beforeEach(async () => {
      license = await License.create({
        name: 'License to Delete',
        description: 'This will be deleted',
        price: 19.99,
        maxDownloads: 1,
        isActive: true,
      });
    });

    it('should delete license type for admin', async () => {
      const response = await adminAgent
        .delete(`/api/licenses/${license._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('License type deleted successfully');

      // Verify license is deleted
      const deletedLicense = await License.findById(license._id);
      expect(deletedLicense).toBeNull();
    });

    it('should not allow seller to delete license type', async () => {
      const response = await sellerAgent
        .delete(`/api/licenses/${license._id}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only admins can delete license types');
    });

    it('should not allow customer to delete license type', async () => {
      const response = await customerAgent
        .delete(`/api/licenses/${license._id}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only admins can delete license types');
    });

    it('should return 404 for non-existent license', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await adminAgent
        .delete(`/api/licenses/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('License not found');
    });
  });
}); 