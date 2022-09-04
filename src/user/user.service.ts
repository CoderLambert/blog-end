import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/index.dto';
import any = jasmine.any;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
      include: {
        articles: true,
      },
    });
  }

  async findAll(limit: number, offset: number) {
    const users = await this.prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        updatedAt: 'asc',
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
}
