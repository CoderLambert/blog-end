import { UserService } from './../user/user.service';
import { LoginUserDto, UserDto } from './../user/dto/index.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/index.dto';
import * as bcrypt from 'bcrypt';
import { AUTH_CONFIG } from '../conifg';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
    // 注意此处需要在 auth module
    // 注册 secret， signOptions, 否则无法生成token
    const payload = { email: data.email, sub: data.id };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: restUser,
    };
  }

  async validateUser(data: LoginUserDto): Promise<any> {
    const user =
      (await this.usersService.findOne({
        email: data.username,
      })) ||
      (await this.usersService.findOne({
        name: data.username,
      }));

    if (user === null) {
      throw new NotFoundException({ message: '用户名不存在' });
    }
    const checkPassword = bcrypt.compareSync(data.password, user.password);
    return checkPassword ? user : null;
  }
}
