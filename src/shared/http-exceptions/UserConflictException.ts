import { ConflictException, HttpStatus } from '@nestjs/common';

export class UserConflictException extends ConflictException {
  constructor(
    objectOrError: string | Record<string, unknown> | any = '用户邮箱已注册',
    description?: string,
  ) {
    super(objectOrError, description);
  }
}
