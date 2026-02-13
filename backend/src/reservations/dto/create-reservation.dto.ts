import { IsString, IsNotEmpty, IsDate, IsDecimal } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsDate()
  @IsNotEmpty()
  checkInDate: Date;

  @IsDate()
  @IsNotEmpty()
  checkOutDate: Date;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @IsString()
  @IsNotEmpty()
  guestEmail: string;

  @IsDecimal()
  @IsNotEmpty()
  totalPrice: number;
}
