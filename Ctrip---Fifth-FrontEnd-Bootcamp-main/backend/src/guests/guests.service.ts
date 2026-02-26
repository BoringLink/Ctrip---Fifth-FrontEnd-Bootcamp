import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Guest, ReservationStatus } from '@prisma/client';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  private prisma = new PrismaClient();

  async createGuest(createGuestDto: CreateGuestDto, reservationId: string): Promise<Guest> {
    // 检查预订是否存在
    const reservation = await this.prisma.reservation.findUnique({ where: { id: reservationId } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // 创建入住人员信息
    const guest = await this.prisma.guest.create({
      data: {
        name: createGuestDto.name,
        idType: createGuestDto.idType,
        idNumber: createGuestDto.idNumber,
        phone: createGuestDto.phone,
      },
    });

    // 关联入住人员和预订
    await this.prisma.reservationGuest.create({
      data: {
        reservationId,
        guestId: guest.id,
      },
    });

    return guest;
  }

  async getGuests(): Promise<Guest[]> {
    // 获取所有入住人员列表
    return this.prisma.guest.findMany({
      include: {
        reservations: {
          include: {
            reservation: {
              include: {
                hotel: true,
                room: true,
              },
            },
          },
        },
      },
    });
  }

  async getGuestById(guestId: string): Promise<Guest> {
    // 获取入住人员详情
    const guest = await this.prisma.guest.findUnique({
      where: { id: guestId },
      include: {
        reservations: {
          include: {
            reservation: {
              include: {
                hotel: true,
                room: true,
              },
            },
          },
        },
      },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return guest;
  }

  async getGuestsByReservation(reservationId: string): Promise<Guest[]> {
    // 检查预订是否存在
    const reservation = await this.prisma.reservation.findUnique({ where: { id: reservationId } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // 获取预订的入住人员列表
    return this.prisma.guest.findMany({
      where: {
        reservations: {
          some: {
            reservationId,
          },
        },
      },
    });
  }

  async getGuestsByHotel(hotelId: string): Promise<Guest[]> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 获取酒店的入住人员列表
    return this.prisma.guest.findMany({
      where: {
        reservations: {
          some: {
            reservation: {
              hotelId,
            },
          },
        },
      },
      include: {
        reservations: {
          include: {
            reservation: {
              include: {
                hotel: true,
                room: true,
              },
            },
          },
        },
      },
    });
  }

  async getGuestsByRoom(roomId: string): Promise<Guest[]> {
    // 检查房型是否存在
    const room = await this.prisma.hotelRoom.findUnique({ where: { id: roomId } });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // 获取房间的入住人员列表
    return this.prisma.guest.findMany({
      where: {
        reservations: {
          some: {
            reservation: {
              roomId,
            },
          },
        },
      },
      include: {
        reservations: {
          include: {
            reservation: {
              include: {
                hotel: true,
                room: true,
              },
            },
          },
        },
      },
    });
  }

  async updateGuest(guestId: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    // 检查入住人员是否存在
    const guest = await this.prisma.guest.findUnique({ where: { id: guestId } });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    // 更新入住人员信息
    return this.prisma.guest.update({
      where: { id: guestId },
      data: {
        name: updateGuestDto.name,
        idType: updateGuestDto.idType,
        idNumber: updateGuestDto.idNumber,
        phone: updateGuestDto.phone,
      },
      include: {
        reservations: {
          include: {
            reservation: {
              include: {
                hotel: true,
                room: true,
              },
            },
          },
        },
      },
    });
  }

  async getCurrentGuestsByHotel(hotelId: string): Promise<Guest[]> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 获取酒店当前入住的人员列表
    const now = new Date();

    return this.prisma.guest.findMany({
      where: {
        reservations: {
          some: {
            reservation: {
              hotelId,
              status: ReservationStatus.check_in,
              checkInDate: {
                lte: now,
              },
              checkOutDate: {
                gte: now,
              },
            },
          },
        },
      },
      include: {
        reservations: {
          include: {
            reservation: {
              include: {
                room: true,
              },
            },
          },
        },
      },
    });
  }
}
