// // src/station/station.controller.ts
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { StationService } from './station.service';
// import { CreateStationDto, UpdateStationDto } from './dto/station.dto';

// @Controller('stations')
// export class StationController {
//   constructor(private readonly stationService: StationService) {}

//   @Post()
//   create(@Body() dto: CreateStationDto) {
//     return this.stationService.create(dto);
//   }

//   @Get()
//   findAll() {
//     return this.stationService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.stationService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() dto: UpdateStationDto) {
//     return this.stationService.update(id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.stationService.remove(id);
//   }
// }

// src/station/station.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { StationService } from './station.service';

@Controller('stations')
export class StationController {
  constructor(private readonly service: StationService) {}

  // ✅ Regular Create
  @Post()
  create(@Body() dto: CreateStationDto) {
        console.log('Creating station with DTO:', dto);
    return this.service.create(dto);
  }

  // ✅ Create with File Uploads
  @Post('with-files')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads/station',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createWithFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateStationDto,
  ) {
    const fileUrls = files.map((file) => file.path.replace(/\\/g, '/'));

    // Assign uploaded files to flowcharts and documentations (in order)
    let index = 0;

    if (dto.flowcharts?.length) {
      dto.flowcharts.forEach((fc) => {
        fc.fileUrl = fileUrls[index++] || fc.fileUrl;
      });
    }

    if (dto.documentations?.length) {
      dto.documentations.forEach((doc) => {
        doc.fileUrl = fileUrls[index++] || doc.fileUrl;
      });
    }

    return this.service.create(dto);
  }

  // ✅ Get all stations
  @Get()
  findAll() {
        console.log('Fetching all stations');
    return this.service.findAll();
  }

  // ✅ Get single station
  @Get(':id')
  findOne(@Param('id') id: string) {
        console.log('Fetching station with ID:', id);
    return this.service.findOne(id);
  }

  // ✅ Update station
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStationDto) {
        console.log('Updating station with ID:', id, 'Data:', dto);

    return this.service.update(id, dto);
  }

  // ✅ Delete station
  @Delete(':id')
  remove(@Param('id') id: string) {
        console.log('Deleting station with ID:', id);
    return this.service.remove(id);
  }
}
