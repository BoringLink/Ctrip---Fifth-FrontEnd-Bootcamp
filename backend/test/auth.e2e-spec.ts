import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'Password123!',
          name: 'Test User',
          role: 'merchant',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.role).toBe('merchant');
    });

    it('should return 400 for invalid request body', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({})
        .expect(400);
    });

    it('should return 400 for weak password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: '123',
          name: 'Test User',
          role: 'merchant',
        })
        .expect(400);
    });

    it('should return 400 for invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          name: 'Test User',
          role: 'merchant',
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // First register a user
      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'Password123!',
          name: 'Test User',
          role: 'merchant',
        });

      // Then login with the same credentials
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: registerResponse.body.user.email,
          password: 'Password123!',
        })
        .expect(201);

      expect(loginResponse.body).toHaveProperty('user');
      expect(loginResponse.body.user).toHaveProperty('id');
      expect(loginResponse.body.user).toHaveProperty('email');
      expect(loginResponse.body.user).toHaveProperty('name');
      expect(loginResponse.body.user).toHaveProperty('role');
      expect(loginResponse.body).toHaveProperty('token');
    });

    it('should return 401 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);
    });

    it('should return 401 for invalid password', async () => {
      // First register a user
      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'Password123!',
          name: 'Test User',
          role: 'merchant',
        });

      // Then login with wrong password
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: registerResponse.body.user.email,
          password: 'WrongPassword!',
        })
        .expect(401);
    });

    it('should return 400 for invalid request body', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile with valid token', async () => {
      // First register and login to get token
      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'Password123!',
          name: 'Test User',
          role: 'merchant',
        });

      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: registerResponse.body.user.email,
          password: 'Password123!',
        });

      const token = loginResponse.body.token;

      // Then get profile with token
      const profileResponse = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body).toHaveProperty('id');
      expect(profileResponse.body).toHaveProperty('email');
      expect(profileResponse.body).toHaveProperty('name');
      expect(profileResponse.body).toHaveProperty('role');
      expect(profileResponse.body.email).toBe(registerResponse.body.user.email);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
