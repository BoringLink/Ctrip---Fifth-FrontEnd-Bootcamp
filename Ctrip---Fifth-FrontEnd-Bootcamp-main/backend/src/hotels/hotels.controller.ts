import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('酒店')
@Controller('api/hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @ApiOperation({
    summary: '创建酒店',
    description: '创建新酒店并返回酒店信息，状态默认为pending',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateHotelDto, description: '酒店信息' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    schema: {
      example: {
        id: 'uuid',
        nameZh: '易宿酒店',
        nameEn: 'Easy Stay Hotel',
        address: '北京市朝阳区',
        starRating: 4,
        openingDate: '2023-01-01T00:00:00Z',
        description: '舒适的商务酒店',
        status: 'pending',
        merchantId: 'uuid',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @Post()
  @UseGuards(AuthGuard)
  async createHotel(@Body() createHotelDto: CreateHotelDto, @Request() req) {
    return this.hotelsService.createHotel(createHotelDto, req.user.id);
  }

  @ApiOperation({
    summary: '获取商户的酒店列表',
    description: '根据当前登录用户获取其管理的酒店列表',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'array',
      example: [
        {
          id: 'uuid',
          nameZh: '易宿酒店',
          nameEn: 'Easy Stay Hotel',
          address: '北京市朝阳区',
          starRating: 4,
          status: 'approved',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @Get('merchant')
  @UseGuards(AuthGuard)
  async getHotelsByMerchant(@Request() req) {
    return this.hotelsService.getHotelsByMerchant(req.user.id);
  }

  @ApiOperation({
    summary: '获取酒店详情',
    description: '根据酒店ID获取酒店详细信息',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '酒店ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        id: 'uuid',
        nameZh: '易宿酒店',
        nameEn: 'Easy Stay Hotel',
        address: '北京市朝阳区',
        starRating: 4,
        openingDate: '2023-01-01T00:00:00Z',
        description: '舒适的商务酒店',
        status: 'approved',
        merchantId: 'uuid',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    },
  })
  @Get('verification')
  @UseGuards(AuthGuard)
  async getHotelsForVerification() {
    return this.hotelsService.getHotelsForVerification();
  }

  @ApiResponse({ status: 404, description: '酒店不存在' })
  @Get(':id')
  async getHotelById(@Param('id') hotelId: string) {
    return this.hotelsService.getHotelById(hotelId);
  }

  @ApiOperation({
    summary: '更新酒店信息',
    description: '根据酒店ID更新酒店信息',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '酒店ID', example: 'uuid' })
  @ApiBody({ type: UpdateHotelDto, description: '酒店更新信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        id: 'uuid',
        nameZh: '易宿酒店',
        nameEn: 'Easy Stay Hotel',
        address: '北京市朝阳区',
        starRating: 4,
        openingDate: '2023-01-01T00:00:00Z',
        description: '舒适的商务酒店',
        status: 'pending',
        merchantId: 'uuid',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateHotel(@Param('id') hotelId: string, @Body() updateHotelDto: UpdateHotelDto, @Request() req) {
    return this.hotelsService.updateHotel(hotelId, updateHotelDto, req.user.id);
  }

  @ApiOperation({
    summary: '删除酒店',
    description: '根据酒店ID删除酒店',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '酒店ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      example: {
        success: true,
        message: '酒店删除成功',
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteHotel(@Param('id') hotelId: string, @Request() req) {
    return this.hotelsService.deleteHotel(hotelId, req.user.id);
  }

  @ApiOperation({
    summary: '查询酒店列表',
    description: '根据查询参数获取酒店列表，支持标签、价格、星级等筛选',
  })
  @ApiQuery({ name: 'tagIds', description: '标签ID数组', required: false, type: [String] })
  @ApiQuery({ name: 'minPrice', description: '最低价格', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', description: '最高价格', required: false, type: Number })
  @ApiQuery({ name: 'minStarRating', description: '最低星级', required: false, type: Number, minimum: 1, maximum: 5 })
  @ApiQuery({ name: 'maxStarRating', description: '最高星级', required: false, type: Number, minimum: 1, maximum: 5 })
  @ApiQuery({ name: 'location', description: '位置', required: false, type: String })
  @ApiQuery({ name: 'keyword', description: '关键词', required: false, type: String })
  @ApiQuery({ name: 'page', description: '页码', required: false, type: Number, minimum: 1 })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false, type: Number, minimum: 1, maximum: 100 })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            nameZh: '易宿酒店',
            nameEn: 'Easy Stay Hotel',
            address: '北京市朝阳区',
            starRating: 4,
            status: 'approved',
            createdAt: '2023-01-01T00:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Put(':id/approve')
  @UseGuards(AuthGuard)
  async approveHotel(@Param('id') hotelId: string) {
    return this.hotelsService.approveHotel(hotelId);
  }

  @Put(':id/reject')
  @UseGuards(AuthGuard)
  async rejectHotel(@Param('id') hotelId: string, @Body() body: { rejectionReason: string }) {
    return this.hotelsService.rejectHotel(hotelId, body.rejectionReason);
  }

  @Put(':id/offline')
  @UseGuards(AuthGuard)
  async offlineHotel(@Param('id') hotelId: string) {
    return this.hotelsService.offlineHotel(hotelId);
  }

  @Put(':id/online')
  @UseGuards(AuthGuard)
  async onlineHotel(@Param('id') hotelId: string) {
    return this.hotelsService.onlineHotel(hotelId);
  }

  @Get()
  async queryHotels(@Query() query: QueryHotelsDto) {
    return this.hotelsService.getHotels(query);
  }
}
