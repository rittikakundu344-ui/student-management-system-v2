import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Mock data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  fullName: 'Test User',
};

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Clear users before tests
    await User.deleteMany({});
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  describe('Register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe(testUser.username);
      expect(res.body.user.email).toBe(testUser.email);

      // Check if user is saved in database
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).toBeTruthy();
    });

    it('should fail if username already exists', async () => {
      // Create user first
      await User.create({
        ...testUser,
        password: await bcryptjs.hash(testUser.password, 10),
      });

      const res = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('already exists');
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          // password is missing
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const hashedPassword = await bcryptjs.hash(testUser.password, 10);
      await User.create({
        username: testUser.username,
        email: testUser.email,
        password: hashedPassword,
        fullName: testUser.fullName,
      });
    });

    it('should login user successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('Invalid');
    });

    it('should fail login if user does not exist', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('Invalid');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/auth/logout');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('Logout');
    });
  });

  describe('Change Password', () => {
    beforeEach(async () => {
      const hashedPassword = await bcryptjs.hash(testUser.password, 10);
      const user = await User.create({
        username: testUser.username,
        email: testUser.email,
        password: hashedPassword,
        fullName: testUser.fullName,
      });

      // Generate a valid token for this user
      global.testToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '7d' }
      );
      global.testUserId = user._id;
    });

    it('should change password successfully', async () => {
      const res = await request(app)
        .post('/auth/change-password')
        .set('Cookie', `token=${global.testToken}`)
        .send({
          oldPassword: testUser.password,
          newPassword: 'newpassword123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('successfully');
    });

    it('should fail with incorrect old password', async () => {
      const res = await request(app)
        .post('/auth/change-password')
        .set('Cookie', `token=${global.testToken}`)
        .send({
          oldPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBeTruthy();
    });
  });
});
