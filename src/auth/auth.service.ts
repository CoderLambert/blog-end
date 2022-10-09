import { UserService } from './../user/user.service';
import { LoginUserDto, UserDto } from './../user/dto/index.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/index.dto';
import * as bcrypt from 'bcrypt';
import { AUTH_CONFIG } from '../conifg';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UserService,
  ) {}

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

  async login(data: UserDto): Promise<any> {
    const { password, createdAt, updatedAt, lastLoginAt, ...restUser } = data;
    return restUser;
  }

  async validateUser(data: LoginUserDto): Promise<any> {
    const user =
      (await this.prisma.user.findUnique({
        where: {
          email: data.username,
        },
      })) ||
      (await this.prisma.user.findUnique({
        where: {
          name: data.username,
        },
      }));

    if (user === null) {
      throw new NotFoundException({ message: '用户名不存在' });
    }

    const checkPassword = bcrypt.compareSync(data.password, user.password);

    if (checkPassword) {
      return user;
    } else {
      return null;
    }
  }
}
