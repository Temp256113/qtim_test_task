import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

const IsOptionalWithSwagger = (example: string | number) => {
  return applyDecorators(
    IsOptional(),
    ApiProperty({
      example,
      required: false,
    }),
  );
};

const IsOptionalNumber = (example: number) => {
  return applyDecorators(IsNumberString(), IsOptionalWithSwagger(example));
};

export class GetArticlesDto {
  @IsOptionalNumber(1)
  page: number;

  @IsOptionalNumber(10)
  pageSize: number;

  @IsString()
  @IsOptionalWithSwagger('temp256113')
  author: string;

  @IsDateString()
  @IsOptionalWithSwagger('2025-03-22')
  publishedAt: string;
}
