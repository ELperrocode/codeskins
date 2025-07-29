import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { build } from '../src/server';
import { User } from '../src/models/User';

describe('Authentication Endpoints', () => {
  let app: FastifyInstance;
  let agent: any;

  beforeAll(async () => {
    app = await build();
    await app.ready();
    agent = request.agent(app.server);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123',
        role: 'customer',
      };

      const response = await request(app.server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.user.role).toBe(userData.role);

      // Verify user was saved in database
      const savedUser = await User.findOne({ username: userData.username });
      expect(savedUser).toBeDefined();
      expect(savedUser?.username).toBe(userData.username);
    });

    it('should not register user with existing username', async () => {
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'customer',
      };

      // Create first user
      await User.create(userData);

      // Try to register with same username
      const response = await request(app.server)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists with this email or username');
    });

    it('should validate required fields', async () => {
      const response = await request(app.server)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should validate password length', async () => {
      const response = await request(app.server)
        .post('/api/auth/register')
        .send({
          username: 'testuser3',
          password: '123',
        })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        username: 'testuser4',
        email: 'test4@example.com',
        password: 'password123',
        role: 'customer',
        isActive: true,
      });
    });

    it('should login user successfully and set a session cookie', async () => {
      const response = await agent
        .post('/api/auth/login')
        .send({
          username: 'testuser4',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.username).toBe('testuser4');
      // Check for session cookie
      const cookieHeader = response.headers['set-cookie'];
      expect(cookieHeader).toBeDefined();
      if (cookieHeader) {
        const cookie = cookieHeader[0];
        expect(cookie).toMatch(/session/);
        expect(cookie).toMatch(/HttpOnly/);
      }
    });

    it('should not login with wrong password', async () => {
      const response = await request(app.server)
        .post('/api/auth/login')
        .send({
          username: 'testuser4',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid username or password');
    });

    it('should not login with non-existent username', async () => {
      const response = await request(app.server)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid username or password');
    });

    it('should not login deactivated user', async () => {
      await User.findOneAndUpdate(
        { username: 'testuser4' },
        { isActive: false },
      );

      const response = await request(app.server)
        .post('/api/auth/login')
        .send({
          username: 'testuser4',
          password: 'password123',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Account is deactivated');
    });
  });

  describe('Authenticated Routes', () => {
    beforeEach(async () => {
      // Create and log in a user to establish a session
      await User.create({
        username: 'testuser5',
        email: 'test5@example.com',
        password: 'password123',
        role: 'customer',
        isActive: true,
      });

      await agent.post('/api/auth/login').send({
        username: 'testuser5',
        password: 'password123',
      });
    });

    describe('GET /api/auth/me', () => {
      it('should get user profile with an active session', async () => {
        const response = await agent.get('/api/auth/me').expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.user.username).toBe('testuser5');
        expect(response.body.data.user.role).toBe('customer');
        expect(response.body.data.user.password).toBeUndefined();
      });
    });

    describe('POST /api/auth/logout', () => {
      it('should logout user and destroy session', async () => {
        const logoutResponse = await agent.post('/api/auth/logout').expect(200);
        expect(logoutResponse.body.success).toBe(true);
        expect(logoutResponse.body.message).toBe('Logout successful');

        // Verify session is destroyed by trying to access a protected route
        const meResponse = await agent.get('/api/auth/me').expect(401);
        expect(meResponse.body.success).toBe(false);
        expect(meResponse.body.message).toBe('Unauthorized: No active session');
      });
    });
  });

  describe('Unauthenticated Access', () => {
    it('should not get profile without an active session', async () => {
      const response = await request(app.server).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorized: No active session');
    });
  });
}); 