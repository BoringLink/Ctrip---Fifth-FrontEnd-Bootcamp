import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, Hotel, HotelStatus } from '@prisma/client';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  private prisma = new PrismaClient();

  async createHotel(createHotelDto: CreateHotelDto, merchantId: string): Promise<Hotel> {
    return this.prisma.hotel.create({
      data: {
        nameZh: createHotelDto.nameZh,
        nameEn: createHotelDto.nameEn,
        address: createHotelDto.address,
        starRating: createHotelDto.starRating,
        openingDate: createHotelDto.openingDate,
        description: createHotelDto.description,
        status: HotelStatus.pending,
        merchantId,
        rooms: createHotelDto.rooms?.length ? { create: createHotelDto.rooms } : undefined,
        facilities: createHotelDto.facilities?.length ? { create: createHotelDto.facilities } : undefined,
        images: createHotelDto.images?.length ? { create: createHotelDto.images } : undefined,
      },
    });
  }

  async getHotelsByMerchant(merchantId: string): Promise<Hotel[]> {
    // 获取商户的酒店列表
    return this.prisma.hotel.findMany({
      where: { merchantId },
      include: {
        rooms: true,
        images: true,
        facilities: true,
        promotions: true,
        nearbyAttractions: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async getHotelById(hotelId: string): Promise<Hotel> {
    // 获取酒店详情
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: true,
        images: true,
        facilities: true,
        promotions: true,
        nearbyAttractions: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async updateHotel(hotelId: string, updateHotelDto: UpdateHotelDto, merchantId: string): Promise<Hotel> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查是否是酒店的商户
    if (hotel.merchantId !== merchantId) {
      throw new ForbiddenException('You are not authorized to update this hotel');
    }

    // 更新酒店信息
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        nameZh: updateHotelDto.nameZh,
        nameEn: updateHotelDto.nameEn,
        address: updateHotelDto.address,
        starRating: updateHotelDto.starRating,
        openingDate: updateHotelDto.openingDate,
        description: updateHotelDto.description,
        ...(updateHotelDto.rooms !== undefined && {
          rooms: { deleteMany: {}, create: updateHotelDto.rooms },
        }),
        ...(updateHotelDto.facilities !== undefined && {
          facilities: { deleteMany: {}, create: updateHotelDto.facilities },
        }),
        ...(updateHotelDto.images !== undefined && {
          images: { deleteMany: {}, create: updateHotelDto.images },
        }),
      },
      include: {
        rooms: true,
        images: true,
        facilities: true,
        promotions: true,
        nearbyAttractions: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async deleteHotel(hotelId: string, merchantId: string): Promise<void> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查是否是酒店的商户
    if (hotel.merchantId !== merchantId) {
      throw new ForbiddenException('You are not authorized to delete this hotel');
    }

    // 删除酒店
    await this.prisma.hotel.delete({ where: { id: hotelId } });
  }

  async getHotelsForVerification(): Promise<Hotel[]> {
    // 获取待审核的酒店列表
    return this.prisma.hotel.findMany({
      where: { status: HotelStatus.pending },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async approveHotel(hotelId: string): Promise<Hotel> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 审核通过酒店
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: { status: HotelStatus.approved },
    });
  }

  async rejectHotel(hotelId: string, rejectionReason: string): Promise<Hotel> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 拒绝酒店
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        status: HotelStatus.rejected,
        rejectionReason,
      },
    });
  }

  async offlineHotel(hotelId: string): Promise<Hotel> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 下线酒店
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: { status: HotelStatus.offline },
    });
  }

  async onlineHotel(hotelId: string): Promise<Hotel> {
    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 上线酒店
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: { status: HotelStatus.approved },
    });
  }

  async getAmapPoi(lat: number, lng: number): Promise<any[]> {
    const url = `https://restapi.amap.com/v3/place/around?key=e8b4c90bcb5a403e4781b73d1aa90b1b&location=${lng},${lat}&keywords=酒店&radius=3000&offset=25&output=json`;
    const res = await fetch(url);
    const data = await res.json() as any;
    return data.pois ?? [];
  }

  async getNearbyHotels(lat: number, lng: number, radiusKm = 10): Promise<any[]> {
    const hotels = await this.prisma.hotel.findMany({
      where: { status: HotelStatus.approved, latitude: { not: null }, longitude: { not: null } },
      include: { rooms: { select: { price: true } }, images: true },
    });
    return hotels.filter(h => {
      const dLat = (h.latitude! - lat) * Math.PI / 180;
      const dLng = (h.longitude! - lng) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat*Math.PI/180)*Math.cos(h.latitude!*Math.PI/180)*Math.sin(dLng/2)**2;
      return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) <= radiusKm;
    });
  }

  async getHotels(query: any): Promise<any> {
    // 构建查询条件
    const where: any = {
      status: HotelStatus.approved,
    };

    // 按标签筛选
    if (query.tagIds && query.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: {
            in: query.tagIds,
          },
        },
      };
    }

    // 按星级范围筛选
    if (query.minStarRating) {
      where.starRating = {
        ...where.starRating,
        gte: query.minStarRating,
      };
    }

    if (query.maxStarRating) {
      where.starRating = {
        ...where.starRating,
        lte: query.maxStarRating,
      };
    }

    // 按位置筛选
    if (query.location) {
      where.address = {
        contains: query.location,
      };
    }

    // 按关键词筛选
    if (query.keyword) {
      where.OR = [
        {
          nameZh: {
            contains: query.keyword,
          },
        },
        {
          nameEn: {
            contains: query.keyword,
          },
        },
        {
          description: {
            contains: query.keyword,
          },
        },
      ];
    }

    // 分页参数
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // 查询酒店列表
    const hotels = await this.prisma.hotel.findMany({
      where,
      include: {
        rooms: {
          select: {
            price: true,
          },
        },
        images: true,
        facilities: true,
        promotions: true,
        nearbyAttractions: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 计算总数
    const total = await this.prisma.hotel.count({ where });

    // 处理价格范围筛选（需要在应用层处理，因为价格存储在房型中）
    const filteredHotels = hotels.filter(hotel => {
      if (!hotel.rooms || hotel.rooms.length === 0) {
        // 没有房型时，只有在没有价格筛选条件时才显示
        return !query.minPrice && !query.maxPrice;
      }

      // 获取酒店最低价格
      const minRoomPrice = Math.min(...hotel.rooms.map(room => room.price.toNumber()));

      // 检查价格范围
      if (query.minPrice && minRoomPrice < query.minPrice) {
        return false;
      }

      if (query.maxPrice && minRoomPrice > query.maxPrice) {
        return false;
      }

      return true;
    });

    return {
      hotels: filteredHotels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
