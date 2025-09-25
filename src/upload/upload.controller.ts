import {
  Controller,
  Post,
  Param,
  UploadedFiles,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './upload.service';

@Controller('uploads')
export class FileUploadController {
  constructor(private readonly uploadService: FileUploadService) {}

  @Post(':uploadType')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const type = req.params.uploadType;
          let folder = './uploads';
          if (type === 'station') folder += '/station';
          else if (type === 'station-mpi') folder += '/station-mpi-docs';
          else if (type === 'mpi-docs') folder += '/mpidocs';
          else return cb(new Error('❌ Invalid upload type'), '');
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFiles(
    @Param('uploadType') uploadType: string,
    @UploadedFiles() files: Array<Express.Multer.File & { fieldname: string }>,
    @Body() body: { stationId?: string; mpiId?: string; description?: string },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    return this.uploadService.handleUpload(uploadType, files, body);
  }
}
