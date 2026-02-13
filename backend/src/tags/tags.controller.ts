import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @Get()
  async getTags() {
    return this.tagsService.getTags();
  }

  @Get(':id')
  async getTagById(@Param('id') tagId: string) {
    return this.tagsService.getTagById(tagId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateTag(@Param('id') tagId: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.updateTag(tagId, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteTag(@Param('id') tagId: string) {
    return this.tagsService.deleteTag(tagId);
  }

  @Post(':tagId/hotels/:hotelId')
  @UseGuards(AuthGuard)
  async associateTagWithHotel(@Param('tagId') tagId: string, @Param('hotelId') hotelId: string) {
    return this.tagsService.associateTagWithHotel(tagId, hotelId);
  }

  @Delete(':tagId/hotels/:hotelId')
  @UseGuards(AuthGuard)
  async disassociateTagFromHotel(@Param('tagId') tagId: string, @Param('hotelId') hotelId: string) {
    return this.tagsService.disassociateTagFromHotel(tagId, hotelId);
  }
}
