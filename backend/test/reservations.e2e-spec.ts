import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('ReservationsController (e2e)', () => {
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

    // Create a hotel for reservation testing
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

  describe('POST /api/reservations', () => {
    it('should create a new reservation successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/reservations')
        .send({
          hotelId,
          roomId: 'room-1',
          checkInDate: '2026-03-01T14:00:00Z',
          checkOutDate: '2026-03-03T12:00:00Z',
          guestName: '张三',
          guestPhone: '13800138000',
          guestEmail: 'zhangsan@example.com',
          totalPrice: 1000,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('hotelId');
      expect(response.body).toHaveProperty('roomId');
      expect(response.body).toHaveProperty('checkInDate');
      expect(response.body).toHaveProperty('checkOutDate');
      expect(response.body).toHaveProperty('guestName');
      expect(response.body).toHaveProperty('status');
      expect(response.body.hotelId).toBe(hotelId);
      expect(response.body.status).toBe('confirmed');
    });

    it('should return 400 for invalid request body', async () => {
      await request(app.getHttpServer())
        .post('/api/reservations')
        .send({})
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/reservations')
        .send({
          hotelId,
          // Missing required fields
        })
        .expect(400);
    });
  });

  describe('GET /api/reservations', () => {
    it('should return reservations list', async () => {
      // First create a reservation
      await request(app.getHttpServer()).post('/api/reservations').send({
        hotelId,
        roomId: 'room-1',
        checkInDate: '2026-03-01T14:00:00Z',
        checkOutDate: '2026-03-03T12:00:00Z',
        guestName: '张三',
        guestPhone: '13800138000',
        guestEmail: 'zhangsan@example.com',
        totalPrice: 1000,
      });

      // Then get reservations list
      const response = await request(app.getHttpServer())
        .get('/api/reservations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/api/reservations').expect(401);
    });
  });

  describe('GET /api/reservations/:id', () => {
    it('should return reservation details', async () => {
      // First create a reservation
      const createResponse = await request(app.getHttpServer())
        .post('/api/reservations')
        .send({
          hotelId,
          roomId: 'room-1',
          checkInDate: '2026-03-01T14:00:00Z',
          checkOutDate: '2026-03-03T12:00:00Z',
          guestName: '张三',
          guestPhone: '13800138000',
          guestEmail: 'zhangsan@example.com',
          totalPrice: 1000,
        });

      const reservationId = createResponse.body.id;

      // Then get reservation details
      const response = await request(app.getHttpServer())
        .get(`/api/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(reservationId);
      expect(response.body).toHaveProperty('hotelId');
      expect(response.body).toHaveProperty('guestName');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/api/reservations/123')
        .expect(401);
    });

    it('should return 404 for non-existent reservation', async () => {
      await request(app.getHttpServer())
        .get('/api/reservations/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /api/reservations/hotel/:hotelId', () => {
    it('should return reservations for a hotel', async () => {
      // First create a reservation for the hotel
      await request(app.getHttpServer()).post('/api/reservations').send({
        hotelId,
        roomId: 'room-1',
        checkInDate: '2026-03-01T14:00:00Z',
        checkOutDate: '2026-03-03T12:00:00Z',
        guestName: '张三',
        guestPhone: '13800138000',
        guestEmail: 'zhangsan@example.com',
        totalPrice: 1000,
      });

      // Then get reservations for the hotel
      const response = await request(app.getHttpServer())
        .get(`/api/reservations/hotel/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get(`/api/reservations/hotel/${hotelId}`)
        .expect(401);
    });
  });

  describe('PUT /api/reservations/:id/check-in', () => {
    it('should check in successfully', async () => {
      // First create a reservation
      const createResponse = await request(app.getHttpServer())
        .post('/api/reservations')
        .send({
          hotelId,
          roomId: 'room-1',
          checkInDate: '2026-03-01T14:00:00Z',
          checkOutDate: '2026-03-03T12:00:00Z',
          guestName: '张三',
          guestPhone: '13800138000',
          guestEmail: 'zhangsan@example.com',
          totalPrice: 1000,
        });

      const reservationId = createResponse.body.id;

      // Then check in
      const response = await request(app.getHttpServer())
        .put(`/api/reservations/${reservationId}/check-in`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(reservationId);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('check_in');
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .put('/api/reservations/123/check-in')
        .expect(401);
    });

    it('should return 404 for non-existent reservation', async () => {
      await request(app.getHttpServer())
        .put('/api/reservations/non-existent-id/check-in')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/reservations/:id/check-out', () => {
    it('should check out successfully', async () => {
      // First create a reservation and check in
      const createResponse = await request(app.getHttpServer())
        .post('/api/reservations')
        .send({
          hotelId,
          roomId: 'room-1',
          checkInDate: '2026-03-01T14:00:00Z',
          checkOutDate: '2026-03-03T12:00:00Z',
          guestName: '张三',
          guestPhone: '13800138000',
          guestEmail: 'zhangsan@example.com',
          totalPrice: 1000,
        });

      const reservationId = createResponse.body.id;

      // Check in first
      await request(app.getHttpServer())
        .put(`/api/reservations/${reservationId}/check-in`)
        .set('Authorization', `Bearer ${token}`);

      // Then check out
      const response = await request(app.getHttpServer())
        .put(`/api/reservations/${reservationId}/check-out`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(reservationId);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('check_out');
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .put('/api/reservations/123/check-out')
        .expect(401);
    });

    it('should return 404 for non-existent reservation', async () => {
      await request(app.getHttpServer())
        .put('/api/reservations/non-existent-id/check-out')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/reservations/:id/cancel', () => {
    it('should cancel reservation successfully', async () => {
      // First create a reservation
      const createResponse = await request(app.getHttpServer())
        .post('/api/reservations')
        .send({
          hotelId,
          roomId: 'room-1',
          checkInDate: '2026-03-01T14:00:00Z',
          checkOutDate: '2026-03-03T12:00:00Z',
          guestName: '张三',
          guestPhone: '13800138000',
          guestEmail: 'zhangsan@example.com',
          totalPrice: 1000,
        });

      const reservationId = createResponse.body.id;

      // Then cancel reservation
      const response = await request(app.getHttpServer())
        .put(`/api/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(reservationId);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('cancelled');
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .put('/api/reservations/123/cancel')
        .expect(401);
    });

    it('should return 404 for non-existent reservation', async () => {
      await request(app.getHttpServer())
        .put('/api/reservations/non-existent-id/cancel')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
