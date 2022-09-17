import helmet from 'helmet';

import { ValidationPipe } from './shared/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInit } from './conifg';

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
  console.log(await app.getUrl());
}
bootstrap();
