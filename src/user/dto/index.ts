import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { User } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PickType } from '@nestjs/swagger';

// https://nestjs.bootcss.com/openapi/mapped-types

export class UserDto implements User {
  @ApiProperty()
  @IsNumberString()
  id: number;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDateString()
  readonly createdAt: Date;

  @ApiProperty()
  @IsDateString()
  readonly updatedAt: Date;

  @ApiProperty()
  @IsDateString()
  lastLoginAt: Date;
}

export class CreateUserDto extends PickType(UserDto, [
  'name',
  'email',
] as const) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
