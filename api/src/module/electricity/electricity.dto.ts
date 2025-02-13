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
export class ElectricityFindFiltersDto extends FindPaginationsDto {
  @Expose()
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cityId?: number;
}

@Exclude()
export class ElectricityDto {
  @Expose()
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  cityId: number;

  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  provider: string;

  @Expose()
  @ApiProperty({ type: Number, default: 0 })
  @Type(() => Number)
  @IsNumber()
  consumption: number;

  @Expose()
  @ApiProperty({ type: Number, default: 0 })
  @Type(() => Number)
  @IsNumber()
  outages: number;

  @Expose()
  @ApiProperty({ type: Number, default: 0 })
  @Type(() => Number)
  @IsNumber()
  renewablePercentage: number;

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
