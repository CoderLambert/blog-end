import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/index.dto';
import * as bcrypt from 'bcrypt';
import { AUTH_CONFIG } from '../conifg';
import { PrismaService } from '../prisma/prisma.service';

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
}
