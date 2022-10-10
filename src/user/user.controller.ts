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
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';
import { ApiPaginatedResponse } from '../decorators';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserInfoDto,
} from './dto/index.dto';
import { SkipJwtAuth } from '../auth/constants';

@ApiTags('用户相关')
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
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({
    summary: '创建用户',
  })
  @ApiOkResponse({
    description: '创建成功返回用户对象',
    type: UserInfoDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserInfoDto> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @SkipJwtAuth()
  @ApiOperation({
    summary: '返回所有用户',
  })
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<PaginatedDto<UserInfoDto>> {
    return (await this.userService.findAll(limit, offset));
  }

  @Get(':id')
  @SkipJwtAuth()
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
    return await this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除所有用户',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove({
      id,
    });
  }

  @Delete('/')
  async removeAll() {
    await this.userService.removeAll();
    return [];
  }
}
