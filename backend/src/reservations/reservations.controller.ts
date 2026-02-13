import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.createReservation(createReservationDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getReservations() {
    return this.reservationsService.getReservations();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getReservationById(@Param('id') reservationId: string) {
    return this.reservationsService.getReservationById(reservationId);
  }

  @Get('hotel/:hotelId')
  @UseGuards(AuthGuard)
  async getReservationsByHotel(@Param('hotelId') hotelId: string) {
    return this.reservationsService.getReservationsByHotel(hotelId);
  }

  @Put(':id/check-in')
  @UseGuards(AuthGuard)
  async checkIn(@Param('id') reservationId: string) {
    return this.reservationsService.checkIn(reservationId);
  }

  @Put(':id/check-out')
  @UseGuards(AuthGuard)
  async checkOut(@Param('id') reservationId: string) {
    return this.reservationsService.checkOut(reservationId);
  }

  @Put(':id/cancel')
  @UseGuards(AuthGuard)
  async cancelReservation(@Param('id') reservationId: string) {
    return this.reservationsService.cancelReservation(reservationId);
  }
}
