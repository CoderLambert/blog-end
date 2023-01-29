import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ArticleTagService } from './article-tag.service';
import {
  ArticleTagDto,
  CreateArticleTagDto,
  UpdateArticleTagDto,
} from './dto/index';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SkipJwtAuth } from '../auth/constants';
import { PaginatedDto } from '../dtos';
import { ApiPaginatedResponse } from '../decorators';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('文章标签相关')
@Controller('article-tag')
@UseGuards(JwtAuthGuard)
export class ArticleTagController {
  constructor(private readonly articleTagsService: ArticleTagService) { }

  // @SkipJwtAuth()
  @Post()
  @ApiOperation({
    summary: '创建文章标签',
  })
  @ApiOkResponse({
    description: '创建成功返回文章标签',
    type: ArticleTagDto,
  })
  @ApiBearerAuth()
  async create(@Body() createArticleDto: CreateArticleTagDto) {
    return this.articleTagsService.create(createArticleDto);
  }

  @Get()
  @SkipJwtAuth()
  @ApiOperation({
    summary: '返回所有文章标签',
  })
  @ApiPaginatedResponse(ArticleTagDto)
  async findAll(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<PaginatedDto<ArticleTagDto>> {
    return this.articleTagsService.findAll(limit, offset);
  }

  @Get(':id')
  @SkipJwtAuth()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleTagsService.findOne({ id });
  }

  @Patch(':id')
  @SkipJwtAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleTagDto: UpdateArticleTagDto,
  ) {
    return this.articleTagsService.update({
      where: { id },
      data: updateArticleTagDto,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @SkipJwtAuth()
  @ApiOperation({
    summary: '删除文章标签',
  })
  // 添加 token 请求头
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articleTagsService.remove({ id });
  }

  @Delete('/')
  @ApiBearerAuth()
  @SkipJwtAuth()
  @ApiOperation({
    summary: '删除所有文章标签',
  })
  async removeAll() {
    return this.articleTagsService.removeAll();
  }
}
