import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth Check (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should register and login successfully', async () => {
    // Register
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test Merchant',
        role: 'merchant',
      })
      .expect(201);

    console.log('Register response:', registerResponse.body);

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: registerResponse.body.user.email,
        password: 'Password123!',
      })
      .expect(201);

    console.log('Login response:', loginResponse.body);

    // Check if token exists
    expect(loginResponse.body).toHaveProperty('token');
    expect(typeof loginResponse.body.token).toBe('string');

    // Try to use the token
    const token = loginResponse.body.token;
    const profileResponse = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    console.log('Profile response:', profileResponse.body);
  });
});
