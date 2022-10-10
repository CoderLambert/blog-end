import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PaginatedDto } from 'src/dtos';
import { UserDto } from 'src/user/dto/index.dto';
import { SITE_CONFIG } from './site';

export function swaggerInit(app: INestApplication) {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(SITE_CONFIG.name)
    .setVersion(SITE_CONFIG.version)
    .setDescription(SITE_CONFIG.description)
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [UserDto]
  });
  SwaggerModule.setup('api-doc', app, document, {
    explorer: true, // 开启搜索列
  });
}
