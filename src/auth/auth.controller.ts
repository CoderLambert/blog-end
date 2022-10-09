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
import { CreateUserDto, LoginUserDto } from '../user/dto/index.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';

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
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: '创建用户',
  })
  async register(@Body() userInfo: CreateUserDto) {
    await this.authService.createUser(userInfo);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  @ApiBody({ description: '用户登录', type: LoginUserDto })
  login(@Request() req): any {
    // 返回 jwt token
    return this.authService.login(req.user);
  }

  @Get('profile/:id')
  async profile(@Param('id') id: number) {
    return id;
  }
}
