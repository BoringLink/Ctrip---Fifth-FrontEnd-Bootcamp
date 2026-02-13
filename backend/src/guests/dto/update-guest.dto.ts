import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { IdType } from '@prisma/client';

export class UpdateGuestDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(1, 50, { message: 'Name length must be between 1 and 50' })
  name?: string;

  @IsOptional()
  @IsEnum(IdType, { message: 'Invalid ID type' })
  idType?: IdType;

  @IsOptional()
  @IsString({ message: 'ID number must be a string' })
  @Length(1, 50, { message: 'ID number length must be between 1 and 50' })
  idNumber?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(1, 20, { message: 'Phone length must be between 1 and 20' })
  phone?: string;
}
