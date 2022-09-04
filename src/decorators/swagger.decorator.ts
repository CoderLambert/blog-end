import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '../dtos';
import any = jasmine.any;
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

export const ApiCreatedSuccessResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiCreatedResponse({
      description: '返回创建对象',
      type: model,
    }),
  );
};

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              total: {
                type: 'number',
              },
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
    ApiQuery({ name: 'limit', example: 20, description: '每页返回数量' }),
    ApiQuery({ name: 'offset', example: 0, description: '当前偏移位置' }),
  );
};
