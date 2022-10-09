import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto, LoginUserDto } from './dto/index.dto';
import * as bcrypt from 'bcrypt';
import { AUTH_CONFIG } from '../conifg';

@Injectable()
export class UserService {
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

  async findAll(limit: number, offset: number) {
    const users = await this.prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        updatedAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const counts = await this.prisma.user.count();
    return {
      limit,
      offset,
      counts,
      items: users,
    };
  }

  async isUserExist(userInfo: Partial<User>): Promise<boolean> {
    const user = this.prisma.user.findUnique({
      where: {
        id: userInfo.id,
      },
    });
    return !!user;
  }

  async findByEmailOrName(userInfo: LoginUserDto) {
    return (
      (await this.findOne({
        email: userInfo.username,
      })) ||
      (await this.findOne({
        name: userInfo.username,
      }))
    );
  }

  findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  remove(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }

  removeAll() {
    return this.prisma.user.deleteMany();
  }
}
