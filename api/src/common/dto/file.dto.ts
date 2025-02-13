import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class FileUploadDto {
  @Expose()
  @ApiProperty({ type: Number, format: 'number' })
  @Type(() => Number)
  @IsNumber()
  cityId: number;

  @Expose()
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
