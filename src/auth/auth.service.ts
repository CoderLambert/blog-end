import { UserService } from './../user/user.service';
import { LoginUserDto, UserDto, UserInfoDto } from './../user/dto/index.dto';
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

  async createUser(data: CreateUserDto): Promise<UserInfoDto> {
    return await this.usersService.createUser(data);
  }

  async login(data: UserDto): Promise<any> {
    const { password, createdAt, updatedAt, lastLoginAt, ...restUser } = data;
    // 注意此处需要在 auth module
    // 注册 secret， signOptions, 否则无法生成token
    const payload = { username: data.name, sub: data.id };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: restUser,
    };
  }

  async validateUser(data: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByEmailOrName(data);
    if (user === null) {
      throw new NotFoundException({ message: '用户名不存在' });
    }
    const checkPassword = bcrypt.compareSync(data.password, user.password);
    return checkPassword ? user : null;
  }
}
