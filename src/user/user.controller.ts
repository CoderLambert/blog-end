import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';
import { ApiPaginatedResponse } from '../decorators';
import { UserDto, UpdateUserDto, CreateUserDto } from './dto/';

@ApiTags('用户相关')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    description: '返回当前创建用户对象',
    type: UserDto,
    status: 201,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query() limit: number,
    @Query() offset: number,
    @Query() size: number,
  ): Promise<PaginatedDto<UserDto>> {
    return this.userService.findAll() as any;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ id: +id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.updateUser({
      where: { id: +id },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove({
      id: +id,
    });
  }
}
