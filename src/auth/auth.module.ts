import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JWT_CONFIG } from '../config/jwt';
@Module({
  imports: [
    PrismaModule,
    UserModule,
    //  确定默认密码策略
    //  http://doc.25years.xyz/#/nestjs/security?id=%e8%ae%a4%e8%af%81%ef%bc%88authentication%ef%bc%89
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_CONFIG.secretKey,
      signOptions: { expiresIn: `${JWT_CONFIG.expiresIn}` },
    }),
  ],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
