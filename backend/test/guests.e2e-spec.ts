import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('GuestsController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let hotelId: string;
  let reservationId: string;

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

    // Create a hotel
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

    // Create a reservation for testing
    const reservationResponse = await request(app.getHttpServer())
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

    reservationId = reservationResponse.body.id;
  });

  describe('POST /guests/:reservationId', () => {
    it('should create a new guest successfully', async () => {
      const response = await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('idType');
      expect(response.body).toHaveProperty('idNumber');
      expect(response.body).toHaveProperty('phone');
      expect(response.body.name).toBe('李四');
      expect(response.body.idType).toBe('id_card');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        })
        .expect(401);
    });

    it('should return 400 for invalid request body', async () => {
      await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });

    it('should return 404 for non-existent reservation', async () => {
      await request(app.getHttpServer())
        .post('/guests/non-existent-reservation')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        })
        .expect(404);
    });
  });

  describe('GET /guests', () => {
    it('should return guests list', async () => {
      // First create a guest
      await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      // Then get guests list
      const response = await request(app.getHttpServer())
        .get('/guests')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/guests').expect(401);
    });
  });

  describe('GET /guests/:id', () => {
    it('should return guest details', async () => {
      // First create a guest
      const createResponse = await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      const guestId = createResponse.body.id;

      // Then get guest details
      const response = await request(app.getHttpServer())
        .get(`/guests/${guestId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(guestId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('idType');
      expect(response.body).toHaveProperty('idNumber');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/guests/123').expect(401);
    });

    it('should return 404 for non-existent guest', async () => {
      await request(app.getHttpServer())
        .get('/guests/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /guests/reservation/:reservationId', () => {
    it('should return guests for a reservation', async () => {
      // First create a guest for the reservation
      await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      // Then get guests for the reservation
      const response = await request(app.getHttpServer())
        .get(`/guests/reservation/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get(`/guests/reservation/${reservationId}`)
        .expect(401);
    });

    it('should return 404 for non-existent reservation', async () => {
      await request(app.getHttpServer())
        .get('/guests/reservation/non-existent-reservation')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /guests/hotel/:hotelId', () => {
    it('should return guests for a hotel', async () => {
      // First create a guest for the reservation (which is associated with the hotel)
      await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      // Then get guests for the hotel
      const response = await request(app.getHttpServer())
        .get(`/guests/hotel/${hotelId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get(`/guests/hotel/${hotelId}`)
        .expect(401);
    });

    it('should return 404 for non-existent hotel', async () => {
      await request(app.getHttpServer())
        .get('/guests/hotel/non-existent-hotel')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /guests/hotel/:hotelId/current', () => {
    it('should return current guests for a hotel', async () => {
      // First create a guest and check in the reservation
      await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      // Check in the reservation
      await request(app.getHttpServer())
        .put(`/api/reservations/${reservationId}/check-in`)
        .set('Authorization', `Bearer ${token}`);

      // Then get current guests for the hotel
      const response = await request(app.getHttpServer())
        .get(`/guests/hotel/${hotelId}/current`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get(`/guests/hotel/${hotelId}/current`)
        .expect(401);
    });

    it('should return 404 for non-existent hotel', async () => {
      await request(app.getHttpServer())
        .get('/guests/hotel/non-existent-hotel/current')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /guests/room/:roomId', () => {
    it('should return guests for a room', async () => {
      // First create a guest for a reservation with a specific room
      await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      // Then get guests for the room
      const response = await request(app.getHttpServer())
        .get('/guests/room/room-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/guests/room/room-1').expect(401);
    });
  });

  describe('PUT /guests/:id', () => {
    it('should update guest information successfully', async () => {
      // First create a guest
      const createResponse = await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      const guestId = createResponse.body.id;

      // Then update guest
      const updateResponse = await request(app.getHttpServer())
        .put(`/guests/${guestId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四（更新）',
          phone: '13900139001',
        })
        .expect(200);

      expect(updateResponse.body).toHaveProperty('id');
      expect(updateResponse.body.id).toBe(guestId);
      expect(updateResponse.body.name).toBe('李四（更新）');
      expect(updateResponse.body.phone).toBe('13900139001');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .put('/guests/123')
        .send({
          name: '李四（更新）',
        })
        .expect(401);
    });

    it('should return 404 for non-existent guest', async () => {
      await request(app.getHttpServer())
        .put('/guests/non-existent-guest')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四（更新）',
        })
        .expect(404);
    });

    it('should return 400 for invalid request body', async () => {
      // First create a guest
      const createResponse = await request(app.getHttpServer())
        .post(`/guests/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '李四',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13900139000',
        });

      const guestId = createResponse.body.id;

      // Then try to update with invalid body
      await request(app.getHttpServer())
        .put(`/guests/${guestId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });
});
