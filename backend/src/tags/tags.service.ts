import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, HotelTag } from '@prisma/client';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaClient) {}

  async createTag(createTagDto: CreateTagDto): Promise<HotelTag> {
    // 创建标签
    return this.prisma.hotelTag.create({
      data: {
        name: createTagDto.name,
        description: createTagDto.description,
      },
    });
  }

  async getTags(): Promise<HotelTag[]> {
    // 获取所有标签列表
    return this.prisma.hotelTag.findMany({
      include: {
        hotels: true,
      },
    });
  }

  async getTagById(tagId: string): Promise<HotelTag> {
    // 获取标签详情
    const tag = await this.prisma.hotelTag.findUnique({
      where: { id: tagId },
      include: {
        hotels: {
          include: {
            hotel: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async updateTag(
    tagId: string,
    updateTagDto: UpdateTagDto,
  ): Promise<HotelTag> {
    // 检查标签是否存在
    const tag = await this.prisma.hotelTag.findUnique({ where: { id: tagId } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 更新标签信息
    return this.prisma.hotelTag.update({
      where: { id: tagId },
      data: {
        name: updateTagDto.name,
        description: updateTagDto.description,
      },
      include: {
        hotels: true,
      },
    });
  }

  async deleteTag(tagId: string): Promise<void> {
    // 检查标签是否存在
    const tag = await this.prisma.hotelTag.findUnique({ where: { id: tagId } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 删除标签
    await this.prisma.hotelTag.delete({ where: { id: tagId } });
  }

  async associateTagWithHotel(tagId: string, hotelId: string): Promise<void> {
    // 检查标签是否存在
    const tag = await this.prisma.hotelTag.findUnique({ where: { id: tagId } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查标签和酒店是否已经关联
    const existingAssociation = await this.prisma.hotelTagRelation.findFirst({
      where: {
        tagId,
        hotelId,
      },
    });

    if (existingAssociation) {
      return;
    }

    // 关联标签和酒店
    await this.prisma.hotelTagRelation.create({
      data: {
        tagId,
        hotelId,
      },
    });
  }

  async disassociateTagFromHotel(
    tagId: string,
    hotelId: string,
  ): Promise<void> {
    // 检查标签是否存在
    const tag = await this.prisma.hotelTag.findUnique({ where: { id: tagId } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 检查酒店是否存在
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 解除标签和酒店的关联
    await this.prisma.hotelTagRelation.deleteMany({
      where: {
        tagId,
        hotelId,
      },
    });
  }
}
