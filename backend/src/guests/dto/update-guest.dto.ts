import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IdType } from '@prisma/client';

export class UpdateGuestDto {
  @ApiProperty({
    description: '姓名',
    example: '张三',
    required: false,
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(1, 50, { message: 'Name length must be between 1 and 50' })
  name?: string;

  @ApiProperty({
    description: '证件类型',
    example: 'id_card',
    required: false,
    enum: IdType,
  })
  @IsOptional()
  @IsEnum(IdType, { message: 'Invalid ID type' })
  idType?: IdType;

  @ApiProperty({
    description: '证件号码',
    example: '110101199001011234',
    required: false,
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'ID number must be a string' })
  @Length(1, 50, { message: 'ID number length must be between 1 and 50' })
  idNumber?: string;

  @ApiProperty({
    description: '电话号码',
    example: '13800138000',
    required: false,
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(1, 20, { message: 'Phone length must be between 1 and 20' })
  phone?: string;
}
