import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  @ApiProperty()
  counts: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  items: T[];
}
