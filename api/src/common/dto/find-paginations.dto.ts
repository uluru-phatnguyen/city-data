import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class FindPaginationsDto {
  @Expose()
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @Expose()
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
