import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  UserDto,
  UserInfoDto,
} from '../user/dto/index.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';
import { UserService } from '../user/user.service';

@ApiTags('用户验证相关')
@ApiExtraModels(PaginatedDto)
@ApiForbiddenResponse({ description: '无操作权限' })
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse({
  description: '操作对象不存在',
})
@ApiBadRequestResponse({
  description: '客户端请求错误',
})
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: '创建用户',
  })
  @ApiOkResponse({
    description: '创建成功返回用户对象',
    type: UserInfoDto,
  })
  async register(@Body() userInfo: CreateUserDto) {
    return await this.authService.createUser(userInfo);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  @ApiBody({ description: '用户登录', type: LoginUserDto })
  async login(@Request() req) {
    // 返回 jwt token
    const token = await this.authService.login(req.user);
    console.log(token);
    return token;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('profile/:id')
  async profile(@Param('id') id: number) {
    return await this.userService.findOne({ id: +id });
  }
}
