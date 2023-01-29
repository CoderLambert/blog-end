import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticleTagController } from './article-tag.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArticleTagService } from './article-tag.service';
@Module({
  controllers: [ArticlesController, ArticleTagController],
  providers: [ArticlesService, ArticleTagService],
  imports: [PrismaModule],
})
export class ArticlesModule { }
