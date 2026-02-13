import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsString({ message: 'Tag name must be a string' })
  @Length(1, 50, { message: 'Tag name length must be between 1 and 50' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 200, { message: 'Description length must be between 0 and 200' })
  description?: string;
}
