import { HttpException, HttpStatus } from '@nestjs/common';

export class UnCaughtException extends HttpException {
  constructor() {
    super('系统运行异常，请联系管理员！', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
