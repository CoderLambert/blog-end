import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/index.dto';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('用户验证相关')
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
    try {
      await this.authService.createUser(userInfo);
    } catch (e) {
      throw e;
    }
  }
}
