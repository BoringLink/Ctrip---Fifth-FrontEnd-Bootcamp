import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('标签')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    summary: '创建标签',
    description: '创建新标签并返回标签信息',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTagDto, description: '标签信息' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    schema: {
      example: {
        id: 'uuid',
        name: '亲子酒店',
        description: '适合家庭出游',
        createdAt: '2023-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @Post()
  @UseGuards(AuthGuard)
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @ApiOperation({
    summary: '获取标签列表',
    description: '获取所有标签的列表',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'array',
      example: [
        {
          id: 'uuid',
          name: '亲子酒店',
          description: '适合家庭出游',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    },
  })
  @Get()
  async getTags() {
    return this.tagsService.getTags();
  }

  @ApiOperation({
    summary: '获取标签详情',
    description: '根据标签ID获取标签详细信息',
  })
  @ApiParam({ name: 'id', description: '标签ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        id: 'uuid',
        name: '亲子酒店',
        description: '适合家庭出游',
        createdAt: '2023-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: '标签不存在' })
  @Get(':id')
  async getTagById(@Param('id') tagId: string) {
    return this.tagsService.getTagById(tagId);
  }

  @ApiOperation({
    summary: '更新标签',
    description: '根据标签ID更新标签信息',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '标签ID', example: 'uuid' })
  @ApiBody({ type: UpdateTagDto, description: '标签更新信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        id: 'uuid',
        name: '亲子酒店',
        description: '适合家庭出游的酒店',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '标签不存在' })
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateTag(@Param('id') tagId: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.updateTag(tagId, updateTagDto);
  }

  @ApiOperation({
    summary: '删除标签',
    description: '根据标签ID删除标签',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '标签ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      example: {
        success: true,
        message: '标签删除成功',
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '标签不存在' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteTag(@Param('id') tagId: string) {
    return this.tagsService.deleteTag(tagId);
  }

  @ApiOperation({
    summary: '关联标签与酒店',
    description: '将标签关联到指定酒店',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'tagId', description: '标签ID', example: 'uuid' })
  @ApiParam({ name: 'hotelId', description: '酒店ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '关联成功',
    schema: {
      example: {
        success: true,
        message: '标签关联成功',
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '标签或酒店不存在' })
  @Post(':tagId/hotels/:hotelId')
  @UseGuards(AuthGuard)
  async associateTagWithHotel(@Param('tagId') tagId: string, @Param('hotelId') hotelId: string) {
    return this.tagsService.associateTagWithHotel(tagId, hotelId);
  }

  @ApiOperation({
    summary: '解除标签与酒店关联',
    description: '解除标签与指定酒店的关联',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'tagId', description: '标签ID', example: 'uuid' })
  @ApiParam({ name: 'hotelId', description: '酒店ID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '解除关联成功',
    schema: {
      example: {
        success: true,
        message: '标签解除关联成功',
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '标签或酒店不存在' })
  @Delete(':tagId/hotels/:hotelId')
  @UseGuards(AuthGuard)
  async disassociateTagFromHotel(@Param('tagId') tagId: string, @Param('hotelId') hotelId: string) {
    return this.tagsService.disassociateTagFromHotel(tagId, hotelId);
  }
}
