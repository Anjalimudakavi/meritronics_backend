import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StationSpecificationService } from './station-specification.service';
import { CreateStationSpecificationDto, UpdateStationSpecificationDto } from './dto/staion-spec.dto';

@Controller('station-specifications')
export class StationSpecificationController {
  constructor(private readonly service: StationSpecificationService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/specs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFileAndCreate(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateStationSpecificationDto,
  ) {
    return this.service.createWithFile(file, body);
  }




  
  @Post()
  create(
    @Body() body: CreateStationSpecificationDto,
  ) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateStationSpecificationDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
