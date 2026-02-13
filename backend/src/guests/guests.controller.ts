import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('guests')
export class GuestsController {
  constructor(private guestsService: GuestsService) {}

  @Post(':reservationId')
  @UseGuards(AuthGuard)
  async createGuest(@Param('reservationId') reservationId: string, @Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.createGuest(createGuestDto, reservationId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getGuests() {
    return this.guestsService.getGuests();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getGuestById(@Param('id') id: string) {
    return this.guestsService.getGuestById(id);
  }

  @Get('reservation/:reservationId')
  @UseGuards(AuthGuard)
  async getGuestsByReservation(@Param('reservationId') reservationId: string) {
    return this.guestsService.getGuestsByReservation(reservationId);
  }

  @Get('hotel/:hotelId')
  @UseGuards(AuthGuard)
  async getGuestsByHotel(@Param('hotelId') hotelId: string) {
    return this.guestsService.getGuestsByHotel(hotelId);
  }

  @Get('hotel/:hotelId/current')
  @UseGuards(AuthGuard)
  async getCurrentGuestsByHotel(@Param('hotelId') hotelId: string) {
    return this.guestsService.getCurrentGuestsByHotel(hotelId);
  }

  @Get('room/:roomId')
  @UseGuards(AuthGuard)
  async getGuestsByRoom(@Param('roomId') roomId: string) {
    return this.guestsService.getGuestsByRoom(roomId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateGuest(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.updateGuest(id, updateGuestDto);
  }
}
