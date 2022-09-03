import {
  IsEmail,
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { User, Prisma } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PickType } from '@nestjs/swagger';

// https://nestjs.bootcss.com/openapi/mapped-types

export class UserDto implements User {
  id: number;
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
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
