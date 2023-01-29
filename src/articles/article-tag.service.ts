import { Injectable } from '@nestjs/common';
import { CreateArticleTagDto, UpdateArticleTagDto } from './dto/index';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ArticleTag } from '@prisma/client';
@Injectable()
export class ArticleTagService {
  constructor(private prisma: PrismaService) { }

  onModuleInit(): any {
    console.log('article tag service onModuleInit');
  }

  async create(createArticleTagDto: CreateArticleTagDto) {
    const tag = await this.prisma.articleTag.create({
      data: {
        ...createArticleTagDto,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        articleId: true,
      },
    });
    return tag;
  }

  async findAll(limit: number, offset: number) {
    const tags = await this.prisma.articleTag.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        updatedAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        articleId: true,
      },
    });
    const counts = await this.prisma.articleTag.count();
    return {
      limit,
      offset,
      counts,
      items: tags,
    };
  }

  async findOne(articleTagUniqueInput: Prisma.ArticleTagWhereUniqueInput) {
    return await this.prisma.articleTag.findUnique({
      where: articleTagUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.ArticleTagWhereUniqueInput;
    data: Prisma.ArticleTagUpdateInput;
  }): Promise<ArticleTag> {
    const { where, data } = params;
    return this.prisma.articleTag.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.ArticleTagWhereUniqueInput) {
    return await this.prisma.articleTag.delete({
      where,
    });
  }

  async removeAll() {
    return await this.prisma.articleTag.deleteMany();
  }
}
