import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Simple Auth Test (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should register and login successfully', async () => {
    // Register a new user
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test User',
        role: 'merchant',
      })
      .expect(201);

    console.log('Register response:', registerResponse.body);

    expect(registerResponse.body).toHaveProperty('token');

    // Login with the same credentials
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: registerResponse.body.user.email,
        password: 'Password123!',
      });

    console.log('Login response status:', loginResponse.status);
    console.log('Login response:', loginResponse.body);

    // Expect 200 OK or 201 Created
    expect(loginResponse.status).toBeGreaterThanOrEqual(200);
    expect(loginResponse.status).toBeLessThan(300);

    expect(loginResponse.body).toHaveProperty('token');

    const token = loginResponse.body.token;
    console.log('Token:', token);

    // Test getting profile with token
    const profileResponse = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    console.log('Profile response:', profileResponse.body);

    expect(profileResponse.body).toHaveProperty('id');
    expect(profileResponse.body).toHaveProperty('email');
  });
});
