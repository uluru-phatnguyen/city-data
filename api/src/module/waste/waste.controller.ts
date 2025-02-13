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
import { WasteService } from './waste.service';
import { WasteDto, WasteFindFiltersDto } from './waste.dto';
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

@Controller('waste')
export class WasteController {
  private readonly logger = new Logger(WasteController.name);

  constructor(
    private readonly wasteService: WasteService,
    private readonly cityService: CityService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() filters: WasteFindFiltersDto) {
    return this.wasteService.findByFilters(filters);
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

    const records: WasteDto[] = await parseCsvFile(
      data.cityId,
      file.path,
      WasteDto,
    );

    const items = await this.wasteService.upsertBulk(records);

    return {
      items: items,
      total: items?.length,
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: WasteDto) {
    const city = await this.cityService.findById(data.cityId);

    if (!city) {
      throw new BadRequestException({
        errorCode: 'INVALID_ID',
        message: 'Invald City Id',
      });
    }

    return await this.wasteService.create(data);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: WasteDto) {
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
