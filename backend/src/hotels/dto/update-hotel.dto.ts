import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateHotelDto {
  @IsString()
  @IsNotEmpty()
  nameZh: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  starRating: number;

  @IsDate()
  @IsNotEmpty()
  openingDate: Date;

  @IsString()
  @IsOptional()
  description?: string;
}
