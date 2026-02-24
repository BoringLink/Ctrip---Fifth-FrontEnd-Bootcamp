import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('HotelsController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login to get token
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test Merchant',
        role: 'merchant',
      })
      .expect(201);

    expect(registerResponse.body).toHaveProperty('user');
    expect(registerResponse.body.user).toHaveProperty('email');

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: registerResponse.body.user.email,
        password: 'Password123!',
      })
      .expect(201);

    token = loginResponse.body.token;
  });

  describe('POST /api/hotels', () => {
    it('should create a new hotel successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '测试酒店',
          nameEn: 'Test Hotel',
          address: '北京市朝阳区',
          starRating: 4,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是一家测试酒店',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nameZh');
      expect(response.body).toHaveProperty('nameEn');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('starRating');
      expect(response.body).toHaveProperty('status');
      expect(response.body.nameZh).toBe('测试酒店');
      expect(response.body.status).toBe('pending');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .post('/api/hotels')
        .send({
          nameZh: '测试酒店',
          nameEn: 'Test Hotel',
          address: '北京市朝阳区',
          starRating: 4,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是一家测试酒店',
        })
        .expect(401);
    });

    it('should return 400 for invalid request body', async () => {
      await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/hotels/merchant', () => {
    it('should return merchant hotels list', async () => {
      // First create a hotel
      await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '测试酒店1',
          nameEn: 'Test Hotel 1',
          address: '北京市朝阳区',
          starRating: 4,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是一家测试酒店',
        });

      // Then get merchant hotels
      const response = await request(app.getHttpServer())
        .get('/api/hotels/merchant')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/api/hotels/merchant')
        .expect(401);
    });
  });

  describe('GET /api/hotels/:id', () => {
    it('should return hotel details', async () => {
      // First create a hotel
      const createResponse = await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '测试酒店',
          nameEn: 'Test Hotel',
          address: '北京市朝阳区',
          starRating: 4,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是一家测试酒店',
        });

      const hotelId = createResponse.body.id;

      // Then get hotel details
      const response = await request(app.getHttpServer())
        .get(`/api/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(hotelId);
      expect(response.body).toHaveProperty('nameZh');
      expect(response.body).toHaveProperty('nameEn');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/api/hotels/123').expect(401);
    });

    it('should return 404 for non-existent hotel', async () => {
      await request(app.getHttpServer())
        .get('/api/hotels/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/hotels/:id', () => {
    it('should update hotel information successfully', async () => {
      // First create a hotel
      const createResponse = await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '测试酒店',
          nameEn: 'Test Hotel',
          address: '北京市朝阳区',
          starRating: 4,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是一家测试酒店',
        });

      const hotelId = createResponse.body.id;

      // Then update hotel
      const updateResponse = await request(app.getHttpServer())
        .put(`/api/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '更新后的测试酒店',
          description: '这是一家更新后的测试酒店',
        })
        .expect(200);

      expect(updateResponse.body).toHaveProperty('id');
      expect(updateResponse.body.id).toBe(hotelId);
      expect(updateResponse.body.nameZh).toBe('更新后的测试酒店');
      expect(updateResponse.body.description).toBe('这是一家更新后的测试酒店');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .put('/api/hotels/123')
        .send({})
        .expect(401);
    });

    it('should return 404 for non-existent hotel', async () => {
      await request(app.getHttpServer())
        .put('/api/hotels/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /api/hotels/:id', () => {
    it('should delete hotel successfully', async () => {
      // First create a hotel
      const createResponse = await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '测试酒店',
          nameEn: 'Test Hotel',
          address: '北京市朝阳区',
          starRating: 4,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是一家测试酒店',
        });

      const hotelId = createResponse.body.id;

      // Then delete hotel
      const response = await request(app.getHttpServer())
        .delete(`/api/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).delete('/api/hotels/123').expect(401);
    });

    it('should return 404 for non-existent hotel', async () => {
      await request(app.getHttpServer())
        .delete('/api/hotels/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /api/hotels', () => {
    it('should return hotels list with filtering', async () => {
      // First create some hotels
      await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '测试酒店1',
          nameEn: 'Test Hotel 1',
          address: '北京市朝阳区',
          starRating: 4,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是一家测试酒店',
        });

      await request(app.getHttpServer())
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nameZh: '测试酒店2',
          nameEn: 'Test Hotel 2',
          address: '上海市浦东新区',
          starRating: 5,
          openingDate: '2023-01-01T00:00:00Z',
          description: '这是另一家测试酒店',
        });

      // Then query hotels with filters
      const response = await request(app.getHttpServer())
        .get('/api/hotels')
        .query({ starRating: 4 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
    });

    it('should return hotels list without filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/hotels')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('total');
    });
  });
});
