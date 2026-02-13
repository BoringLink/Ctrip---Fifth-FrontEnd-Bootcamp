import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createHotel(@Body() createHotelDto: CreateHotelDto, @Request() req) {
    return this.hotelsService.createHotel(createHotelDto, req.user.id);
  }

  @Get('merchant')
  @UseGuards(AuthGuard)
  async getHotelsByMerchant(@Request() req) {
    return this.hotelsService.getHotelsByMerchant(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getHotelById(@Param('id') hotelId: string) {
    return this.hotelsService.getHotelById(hotelId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateHotel(@Param('id') hotelId: string, @Body() updateHotelDto: UpdateHotelDto, @Request() req) {
    return this.hotelsService.updateHotel(hotelId, updateHotelDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteHotel(@Param('id') hotelId: string, @Request() req) {
    return this.hotelsService.deleteHotel(hotelId, req.user.id);
  }

  @Get()
  async queryHotels(@Query() query: QueryHotelsDto) {
    return this.hotelsService.getHotels(query);
  }
}
