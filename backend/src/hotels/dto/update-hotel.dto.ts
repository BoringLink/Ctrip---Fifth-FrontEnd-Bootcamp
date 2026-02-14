import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHotelDto {
  @ApiProperty({
    description: '酒店中文名',
    example: '易宿酒店',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nameZh: string;

  @ApiProperty({
    description: '酒店英文名',
    example: 'Easy Stay Hotel',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({
    description: '酒店地址',
    example: '北京市朝阳区',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: '酒店星级',
    example: 4,
    required: true,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  starRating: number;

  @ApiProperty({
    description: '酒店开业时间',
    example: '2023-01-01',
    required: true,
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  openingDate: Date;

  @ApiProperty({
    description: '酒店描述',
    example: '舒适的商务酒店',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
