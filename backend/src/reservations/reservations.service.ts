import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, Reservation, ReservationStatus } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  private prisma = new PrismaClient();

  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: createReservationDto.hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查房型是否存在
    const room = await this.prisma.hotelRoom.findUnique({ where: { id: createReservationDto.roomId } });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // 检查房型是否属于该酒店
    if (room.hotelId !== createReservationDto.hotelId) {
      throw new ForbiddenException('Room does not belong to the specified hotel');
    }

    // 创建预订
    return this.prisma.reservation.create({
      data: {
        hotelId: createReservationDto.hotelId,
        roomId: createReservationDto.roomId,
        checkInDate: createReservationDto.checkInDate,
        checkOutDate: createReservationDto.checkOutDate,
        guestName: createReservationDto.guestName,
        guestPhone: createReservationDto.guestPhone,
        guestEmail: createReservationDto.guestEmail,
        status: ReservationStatus.confirmed,
        totalPrice: createReservationDto.totalPrice,
      },
      include: {
        hotel: true,
        room: true,
        guests: {
          include: {
            guest: true,
          },
        },
      },
    });
  }

  async getReservations(): Promise<Reservation[]> {
    // 获取所有预订列表
    return this.prisma.reservation.findMany({
      include: {
        hotel: true,
        room: true,
        guests: {
          include: {
            guest: true,
          },
        },
      },
    });
  }

  async getReservationById(reservationId: string): Promise<Reservation> {
    // 获取预订详情
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        hotel: true,
        room: true,
        guests: {
          include: {
            guest: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async getReservationsByHotel(hotelId: string): Promise<Reservation[]> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 获取酒店的预订列表
    return this.prisma.reservation.findMany({
      where: { hotelId },
      include: {
        room: true,
        guests: {
          include: {
            guest: true,
          },
        },
      },
    });
  }

  async checkIn(reservationId: string): Promise<Reservation> {
    // 检查预订是否存在
    const reservation = await this.prisma.reservation.findUnique({ where: { id: reservationId } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // 检查预订状态
    if (reservation.status !== ReservationStatus.confirmed) {
      throw new ForbiddenException('Reservation status must be confirmed to check in');
    }

    // 更新预订状态为已入住
    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.check_in },
      include: {
        hotel: true,
        room: true,
        guests: {
          include: {
            guest: true,
          },
        },
      },
    });
  }

  async checkOut(reservationId: string): Promise<Reservation> {
    // 检查预订是否存在
    const reservation = await this.prisma.reservation.findUnique({ where: { id: reservationId } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // 检查预订状态
    if (reservation.status !== ReservationStatus.check_in) {
      throw new ForbiddenException('Reservation status must be checked in to check out');
    }

    // 更新预订状态为已退房
    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.check_out },
      include: {
        hotel: true,
        room: true,
        guests: {
          include: {
            guest: true,
          },
        },
      },
    });
  }

  async cancelReservation(reservationId: string): Promise<Reservation> {
    // 检查预订是否存在
    const reservation = await this.prisma.reservation.findUnique({ where: { id: reservationId } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // 检查预订状态
    if (reservation.status === ReservationStatus.check_out) {
      throw new ForbiddenException('Cannot cancel a checked out reservation');
    }

    // 更新预订状态为已取消
    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.cancelled },
      include: {
        hotel: true,
        room: true,
        guests: {
          include: {
            guest: true,
          },
        },
      },
    });
  }
}
