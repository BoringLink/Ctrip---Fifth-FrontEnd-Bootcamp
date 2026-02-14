import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IdType } from '@prisma/client';

export class CreateGuestDto {
  @ApiProperty({
    description: '姓名',
    example: '张三',
    required: true,
    minLength: 1,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(1, 50, { message: 'Name length must be between 1 and 50' })
  name: string;

  @ApiProperty({
    description: '证件类型',
    example: 'id_card',
    required: true,
    enum: IdType,
  })
  @IsNotEmpty({ message: 'ID type is required' })
  @IsEnum(IdType, { message: 'Invalid ID type' })
  idType: IdType;

  @ApiProperty({
    description: '证件号码',
    example: '110101199001011234',
    required: true,
    minLength: 1,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'ID number is required' })
  @IsString({ message: 'ID number must be a string' })
  @Length(1, 50, { message: 'ID number length must be between 1 and 50' })
  idNumber: string;

  @ApiProperty({
    description: '电话号码',
    example: '13800138000',
    required: true,
    minLength: 1,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  @Length(1, 20, { message: 'Phone length must be between 1 and 20' })
  phone: string;
}
