import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ElectricityService } from './electricity.service';
import { ElectricityDto, ElectricityFindFiltersDto } from './electricity.dto';
import { FileUploadDto } from './../../common/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  // ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { csvFileFilter } from './../../common/util';
import { parseCsvFile } from './../../common/helper';
import { CityService } from '../city/city.service';

@Controller('electricity')
export class ElectricityController {
  private readonly logger = new Logger(ElectricityController.name);

  constructor(
    private readonly electricityService: ElectricityService,
    private readonly cityService: CityService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() filters: ElectricityFindFiltersDto) {
    return this.electricityService.findByFilters(filters);
  }

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
      fileFilter: csvFileFilter,
    }),
  )
  async upload(
    @Body() data: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.path) {
      throw new BadRequestException({
        message: 'File not found',
        errorCode: 'FILE_NOT_FOUND',
      });
    }

    const city = await this.cityService.findById(data.cityId);

    if (!city) {
      throw new BadRequestException({
        errorCode: 'INVALID_ID',
        message: 'Invald City Id',
      });
    }

    const records: ElectricityDto[] = await parseCsvFile(
      data.cityId,
      file.path,
      ElectricityDto,
    );

    const items = await this.electricityService.upsertBulk(records);

    return {
      items: items,
      total: items?.length,
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: ElectricityDto) {
    const city = await this.cityService.findById(data.cityId);

    if (!city) {
      throw new BadRequestException({
        errorCode: 'INVALID_ID',
        message: 'Invald City Id',
      });
    }

    return await this.electricityService.create(data);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ElectricityDto,
  ) {
    const city = await this.cityService.findById(data.cityId);

    if (!city) {
      throw new BadRequestException({
        errorCode: 'INVALID_ID',
        message: 'Invald City Id',
      });
    }

    return {
      ...data,
      id,
      city,
    };
  }
}
