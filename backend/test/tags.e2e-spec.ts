import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('TagsController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let hotelId: string;

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

    // Create a hotel for tag association testing
    const hotelResponse = await request(app.getHttpServer())
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

    hotelId = hotelResponse.body.id;
  });

  describe('POST /tags', () => {
    it('should create a new tag successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body.name).toBe('亲子酒店');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .post('/tags')
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        })
        .expect(401);
    });

    it('should return 400 for invalid request body', async () => {
      await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Missing name field
          description: '适合家庭出游的酒店',
        })
        .expect(400);
    });
  });

  describe('GET /tags', () => {
    it('should return tags list', async () => {
      // First create a tag
      await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      // Then get tags list
      const response = await request(app.getHttpServer())
        .get('/tags')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return empty array if no tags exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/tags')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /tags/:id', () => {
    it('should return tag details', async () => {
      // First create a tag
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Then get tag details
      const response = await request(app.getHttpServer())
        .get(`/tags/${tagId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(tagId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
    });

    it('should return 404 for non-existent tag', async () => {
      await request(app.getHttpServer())
        .get('/tags/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /tags/:id', () => {
    it('should update tag information successfully', async () => {
      // First create a tag
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Then update tag
      const updateResponse = await request(app.getHttpServer())
        .put(`/tags/${tagId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子度假酒店',
          description: '适合家庭出游的度假酒店',
        })
        .expect(200);

      expect(updateResponse.body).toHaveProperty('id');
      expect(updateResponse.body.id).toBe(tagId);
      expect(updateResponse.body.name).toBe('亲子度假酒店');
      expect(updateResponse.body.description).toBe('适合家庭出游的度假酒店');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .put('/tags/123')
        .send({
          name: '亲子度假酒店',
        })
        .expect(401);
    });

    it('should return 404 for non-existent tag', async () => {
      await request(app.getHttpServer())
        .put('/tags/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子度假酒店',
        })
        .expect(404);
    });

    it('should return 400 for invalid request body', async () => {
      // First create a tag
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Then try to update with invalid body
      await request(app.getHttpServer())
        .put(`/tags/${tagId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /tags/:id', () => {
    it('should delete tag successfully', async () => {
      // First create a tag
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Then delete tag
      const response = await request(app.getHttpServer())
        .delete(`/tags/${tagId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).delete('/tags/123').expect(401);
    });

    it('should return 404 for non-existent tag', async () => {
      await request(app.getHttpServer())
        .delete('/tags/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('POST /tags/:tagId/hotels/:hotelId', () => {
    it('should associate tag with hotel successfully', async () => {
      // First create a tag
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Then associate tag with hotel
      const response = await request(app.getHttpServer())
        .post(`/tags/${tagId}/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .post(`/tags/123/hotels/${hotelId}`)
        .expect(401);
    });

    it('should return 404 for non-existent tag', async () => {
      await request(app.getHttpServer())
        .post(`/tags/non-existent-tag/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return 404 for non-existent hotel', async () => {
      // First create a tag
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Then try to associate with non-existent hotel
      await request(app.getHttpServer())
        .post(`/tags/${tagId}/hotels/non-existent-hotel`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('DELETE /tags/:tagId/hotels/:hotelId', () => {
    it('should disassociate tag from hotel successfully', async () => {
      // First create a tag and associate it with hotel
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Associate tag with hotel
      await request(app.getHttpServer())
        .post(`/tags/${tagId}/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`);

      // Then disassociate tag from hotel
      const response = await request(app.getHttpServer())
        .delete(`/tags/${tagId}/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .delete(`/tags/123/hotels/${hotelId}`)
        .expect(401);
    });

    it('should return 404 for non-existent tag', async () => {
      await request(app.getHttpServer())
        .delete(`/tags/non-existent-tag/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return 404 for non-existent hotel', async () => {
      // First create a tag
      const createResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '亲子酒店',
          description: '适合家庭出游的酒店',
        });

      const tagId = createResponse.body.id;

      // Then try to disassociate from non-existent hotel
      await request(app.getHttpServer())
        .delete(`/tags/${tagId}/hotels/non-existent-hotel`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
