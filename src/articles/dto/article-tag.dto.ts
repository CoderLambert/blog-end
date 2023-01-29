import {
    IsDateString,
    IsNotEmpty,
    IsNumberString,
    IsString,
    IsOptional,
} from 'class-validator';
import { ArticleTag } from '@prisma/client';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class ArticleTagDto implements ArticleTag {
    @IsNumberString()
    id: number;

    @ApiProperty({
        example: 'nestjs',
        description: '标签',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumberString()
    @IsOptional()
    articleId: number;

    @IsDateString()
    readonly createdAt: Date;

    @IsDateString()
    readonly updatedAt: Date;
}


export class CreateArticleTagDto extends PickType(ArticleTagDto, [
    'name',
] as const) { }

export class UpdateArticleTagDto extends PartialType(CreateArticleTagDto) { }