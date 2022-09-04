import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';
import { ApiCreatedSuccessResponse, ApiPaginatedResponse } from '../decorators';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/index.dto';
import { Prisma } from '@prisma/client';
import { constants } from 'http2';
import { Type } from 'class-transformer';

function catchErrorHandle(error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    throw new NotFoundException('用户不存在');
  } else console.error(error);
}

@ApiTags('用户相关')
@Controller('users')
@ApiExtraModels(PaginatedDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '创建用户',
  })
  @ApiCreatedSuccessResponse(UserDto)
  @ApiForbiddenResponse({ description: '无操作权限!' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<PaginatedDto<UserDto>> {
    return this.userService.findAll(limit, offset);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ id });
    if (user) {
      return user;
    } else {
      throw new NotFoundException('用户不存在');
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.userService.updateUser({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      catchErrorHandle(error);
    }
  }

  @Delete(':id')
  @ApiNotFoundResponse({
    description: '操作对象不存在',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  async remove(@Param('id') id: string) {
    try {
      const deletedUser = await this.userService.remove({
        id: +id,
      });
      return deletedUser;
    } catch (error) {
      catchErrorHandle(error);
    }
  }
}
