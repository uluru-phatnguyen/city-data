import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FindPaginationsDto } from './../../common/dto';

export enum ESource {
  API = 'api',
  MANUAL = 'manual',
}

@Exclude()
export class WasteFindFiltersDto extends FindPaginationsDto {
  @Expose()
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cityId?: number;
}

@Exclude()
export class WasteDto {
  @Expose()
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  cityId: number;

  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  type: string;

  @Expose()
  @ApiProperty({ type: Number, default: 0 })
  @Type(() => Number)
  @IsNumber()
  weight: number;

  @Expose()
  @ApiProperty({ type: Date })
  @IsDateString()
  dateRecorded: Date;

  @Expose()
  @ApiProperty({ enum: ESource, default: ESource.MANUAL })
  @IsEnum(ESource)
  @IsString()
  source: ESource;
}
