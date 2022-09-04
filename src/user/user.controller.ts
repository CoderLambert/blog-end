import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Type,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';
import { ApiCreatedSuccessResponse, ApiPaginatedResponse } from '../decorators';
import { UserDto, CreateUserDto } from './dto/index.dto';

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
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<PaginatedDto<UserDto>> {
    return this.userService.findAll(limit, offset);
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
