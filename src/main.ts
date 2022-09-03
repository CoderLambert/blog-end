import helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInit } from './conifg/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 添加 Dto 验证
  app.useGlobalPipes(new ValidationPipe());
  // 跨域
  app.enableCors();
  swaggerInit(app);
  // web 漏洞
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
