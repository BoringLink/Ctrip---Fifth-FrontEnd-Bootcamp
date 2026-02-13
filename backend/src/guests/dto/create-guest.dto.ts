import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { IdType } from '@prisma/client';

export class CreateGuestDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(1, 50, { message: 'Name length must be between 1 and 50' })
  name: string;

  @IsNotEmpty({ message: 'ID type is required' })
  @IsEnum(IdType, { message: 'Invalid ID type' })
  idType: IdType;

  @IsNotEmpty({ message: 'ID number is required' })
  @IsString({ message: 'ID number must be a string' })
  @Length(1, 50, { message: 'ID number length must be between 1 and 50' })
  idNumber: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  @Length(1, 20, { message: 'Phone length must be between 1 and 20' })
  phone: string;
}
