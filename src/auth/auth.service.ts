import { LoginUserDto } from './../user/dto/index.dto';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/index.dto';
import * as bcrypt from 'bcrypt';
import { AUTH_CONFIG } from '../conifg';
import { PrismaService } from '../prisma/prisma.service';
import { UserInfo } from 'os';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<void> {
    const hashPassword = await bcrypt.hash(
      data.password,
      AUTH_CONFIG.saltRounds,
    );
    try {
      await this.prisma.user.create({
        data: {
          ...data,
          password: hashPassword,
        },
        select: null,
      });
    } catch (e) {
      throw e;
    }
  }

  async login(data: LoginUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    const checkPassword = await bcrypt.compareSync(
      data.password,
      user.password,
    );

    if (checkPassword) {
      return user;
    } else {
      return '用户不存在';
    }
  }
}
