import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '@prisma/client';
import { ApiProperty, OmitType, PickType, PartialType } from '@nestjs/swagger';

// https://nestjs.bootcss.com/openapi/mapped-types

export class UserDto implements User {
  @IsNumberString()
  id: number;

  @ApiProperty({
    example: 'lambert',
    description: '用户名',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'l156486648@163.com',
    description: '用户邮箱',
  })
  @IsEmail({
    message: '邮箱格式不正确',
  })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: '用户密码',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsDateString()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;

  @IsDateString()
  lastLoginAt: Date;
}

export class CreateUserDto extends PickType(UserDto, [
  'name',
  'email',
  'password',
] as const) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
