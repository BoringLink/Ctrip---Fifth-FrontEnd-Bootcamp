import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: '标签名称',
    example: '亲子酒店',
    required: true,
    minLength: 1,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Tag name is required' })
  @IsString({ message: 'Tag name must be a string' })
  @Length(1, 50, { message: 'Tag name length must be between 1 and 50' })
  name: string;

  @ApiProperty({
    description: '标签描述',
    example: '适合家庭出游',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 200, { message: 'Description length must be between 0 and 200' })
  description?: string;
}
