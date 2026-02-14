import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('入住人员')
@Controller('guests')
export class GuestsController {
  constructor(private guestsService: GuestsService) {}

  @ApiOperation({
    summary: '添加入住人员',
    description: '为指定预订添加入住人员信息',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'reservationId', description: '预订ID', example: 'uuid' })
  @ApiBody({ type: CreateGuestDto, description: '入住人员信息' })
  @ApiResponse({
    status: 201,
    description: '添加成功',
    schema: {
      example: {
        id: 'uuid',
        name: '张三',
        idType: 'id_card',
        idNumber: '110101199001011234',
        phone: '13800138000',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '预订不存在' })
  @Post(':reservationId')
  @UseGuards(AuthGuard)
  async createGuest(@Param('reservationId') reservationId: string, @Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.createGuest(createGuestDto, reservationId);
  }

  @ApiOperation({
    summary: '获取入住人员列表',
    description: '获取所有入住人员的列表',
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
          name: '张三',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13800138000',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @Get()
  @UseGuards(AuthGuard)
  async getGuests() {
    return this.guestsService.getGuests();
  }

  @ApiOperation({
    summary: '获取入住人员详情',
    description: '根据入住人员ID获取详细信息',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '入住人员ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        id: 'uuid',
        name: '张三',
        idType: 'id_card',
        idNumber: '110101199001011234',
        phone: '13800138000',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '入住人员不存在' })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getGuestById(@Param('id') id: string) {
    return this.guestsService.getGuestById(id);
  }

  @ApiOperation({
    summary: '获取预订的入住人员列表',
    description: '根据预订ID获取该预订的入住人员列表',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'reservationId', description: '预订ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'array',
      example: [
        {
          id: 'uuid',
          name: '张三',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13800138000',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '预订不存在' })
  @Get('reservation/:reservationId')
  @UseGuards(AuthGuard)
  async getGuestsByReservation(@Param('reservationId') reservationId: string) {
    return this.guestsService.getGuestsByReservation(reservationId);
  }

  @ApiOperation({
    summary: '获取酒店的入住人员列表',
    description: '根据酒店ID获取该酒店的入住人员列表',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'hotelId', description: '酒店ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'array',
      example: [
        {
          id: 'uuid',
          name: '张三',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13800138000',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  @Get('hotel/:hotelId')
  @UseGuards(AuthGuard)
  async getGuestsByHotel(@Param('hotelId') hotelId: string) {
    return this.guestsService.getGuestsByHotel(hotelId);
  }

  @ApiOperation({
    summary: '获取酒店当前入住人员列表',
    description: '根据酒店ID获取该酒店当前正在入住的人员列表',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'hotelId', description: '酒店ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'array',
      example: [
        {
          id: 'uuid',
          name: '张三',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13800138000',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  @Get('hotel/:hotelId/current')
  @UseGuards(AuthGuard)
  async getCurrentGuestsByHotel(@Param('hotelId') hotelId: string) {
    return this.guestsService.getCurrentGuestsByHotel(hotelId);
  }

  @ApiOperation({
    summary: '获取房间的入住人员列表',
    description: '根据房间ID获取该房间的入住人员列表',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'roomId', description: '房间ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'array',
      example: [
        {
          id: 'uuid',
          name: '张三',
          idType: 'id_card',
          idNumber: '110101199001011234',
          phone: '13800138000',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '房间不存在' })
  @Get('room/:roomId')
  @UseGuards(AuthGuard)
  async getGuestsByRoom(@Param('roomId') roomId: string) {
    return this.guestsService.getGuestsByRoom(roomId);
  }

  @ApiOperation({
    summary: '更新入住人员信息',
    description: '根据入住人员ID更新信息',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '入住人员ID', example: 'uuid' })
  @ApiBody({ type: UpdateGuestDto, description: '入住人员更新信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        id: 'uuid',
        name: '张三',
        idType: 'id_card',
        idNumber: '110101199001011234',
        phone: '13800138000',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '入住人员不存在' })
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateGuest(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.updateGuest(id, updateGuestDto);
  }
}
