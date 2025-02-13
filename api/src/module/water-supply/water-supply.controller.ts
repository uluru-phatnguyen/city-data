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
import { WaterSupplyService } from './water-supply.service';
import { WaterSupplyDto, WaterSupplyFindFiltersDto } from './water-supply.dto';
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

@Controller('water-supply')
export class WaterSupplyController {
  private readonly logger = new Logger(WaterSupplyController.name);

  constructor(
    private readonly waterService: WaterSupplyService,
    private readonly cityService: CityService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() filters: WaterSupplyFindFiltersDto) {
    return this.waterService.findByFilters(filters);
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

    const records: WaterSupplyDto[] = await parseCsvFile(
      data.cityId,
      file.path,
      WaterSupplyDto,
    );

    const items = await this.waterService.upsertBulk(records);

    return {
      items: items,
      total: items?.length,
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: WaterSupplyDto) {
    const city = await this.cityService.findById(data.cityId);

    if (!city) {
      throw new BadRequestException({
        errorCode: 'INVALID_ID',
        message: 'Invald City Id',
      });
    }

    return await this.waterService.create(data);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: WaterSupplyDto,
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
