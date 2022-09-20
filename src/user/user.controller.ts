import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Catch,
  UseFilters,
  HttpCode,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';
import { ApiCreatedSuccessResponse, ApiPaginatedResponse } from '../decorators';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserInfoDto,
} from './dto/index.dto';
import { Prisma } from '@prisma/client';

function catchErrorHandle(error) {
  if (error.code === 'P2002') {
    throw new ConflictException('当前用户邮箱已注册');
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    throw new NotFoundException('用户不存在');
  } else {
    throw error;
  }
}

@ApiTags('用户相关')
@ApiExtraModels(PaginatedDto)
@ApiForbiddenResponse({ description: '无操作权限' })
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse({
  description: '操作对象不存在',
})
@ApiBadRequestResponse({
  description: '客户端请求错误',
})
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '创建用户',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (e) {
      catchErrorHandle(e);
    }
  }

  @Get()
  @ApiOperation({
    summary: '返回所有用户',
  })
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<PaginatedDto<UserDto>> {
    return (await this.userService.findAll(limit, offset)) as any;
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
      return await this.userService.updateUser({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      catchErrorHandle(error);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除所有用户',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userService.remove({
        id,
      });
    } catch (error) {
      catchErrorHandle(error);
    }
  }

  @Delete('/')
  async removeAll() {
    try {
      const res = await this.userService.removeAll();
      return [];
    } catch (error) {
      catchErrorHandle(error);
    }
  }
}
