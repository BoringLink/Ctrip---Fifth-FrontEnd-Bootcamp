import { IsString, IsNotEmpty, IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({
    description: '酒店ID',
    example: 'uuid',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({
    description: '房型ID',
    example: 'uuid',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({
    description: '入住日期',
    example: '2023-01-01',
    required: true,
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  checkInDate: Date;

  @ApiProperty({
    description: '退房日期',
    example: '2023-01-02',
    required: true,
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  checkOutDate: Date;

  @ApiProperty({
    description: '客人姓名',
    example: '张三',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({
    description: '客人电话',
    example: '13800138000',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @ApiProperty({
    description: '客人邮箱',
    example: 'zhangsan@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  guestEmail: string;

  @ApiProperty({
    description: '总价',
    example: 500,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
