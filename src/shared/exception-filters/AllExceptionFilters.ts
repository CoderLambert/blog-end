import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      let responseBody = {
        statusCode: status,
        message: '内部发生错误',
      };

      if (exception.code === 'P2002') {
        responseBody = {
          statusCode: HttpStatus.CONFLICT,
          message: '当前对象已存在',
        };
      }
      if (exception.code === 'P2025') {
        responseBody = {
          statusCode: HttpStatus.NOT_FOUND,
          message: '当前对象不存在',
        };
      }
      httpAdapter.reply(ctx.getResponse(), responseBody, status);
    } else if (exception instanceof HttpException) {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          statusCode: status,
          message: exception.message,
          error: exception.name,
        },
        status,
      );
    } else {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          statusCode: status,
          message: '发生异常错误',
          error: exception,
        },
        status,
      );
    }
  }
}
