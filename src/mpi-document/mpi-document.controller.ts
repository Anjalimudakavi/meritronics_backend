// import {
//   Controller,
//   Post,
//   Param,
//   UploadedFile,
//   UseInterceptors,
//   Body,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { MpiDocumentService } from './mpi-document.service';

// @Controller('mpi-document')
// export class MpiDocumentController {
//   constructor(private readonly mpiDocumentService: MpiDocumentService) {}

//   @Post(':mpiId/upload')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads/mpidocs',
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   )
//   async uploadFile(
//     @Param('mpiId') mpiId: string,
//     @UploadedFile() file: Express.Multer.File,
//     @Body('description') description?: string,
//   )
//    {
//     const fileUrl = `/uploads/mpidocs/${file.filename}`;
//     return this.mpiDocumentService.create({
//       fileUrl,
//       description,
//       mpiId,
//     });
//   }
// }


import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MpiDocumentService } from './mpi-document.service';
import { unlinkSync } from 'fs';

@Controller('mpi-document')
export class MpiDocumentController {
  constructor(private readonly mpiDocumentService: MpiDocumentService) {}

  // CREATE
  @Post(':mpiId/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/mpidocs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('mpiId') mpiId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
  ) {
    const fileUrl = `/uploads/mpidocs/${file.filename}`;
    return this.mpiDocumentService.create({
      fileUrl,
      description,
      mpiId,
    });
  }

  // READ ALL
  @Get()
  async findAll() {
    return this.mpiDocumentService.findAll();
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.mpiDocumentService.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  // UPDATE DESCRIPTION
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('description') description: string,
  ) {
    return this.mpiDocumentService.update(id, { description });
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const doc = await this.mpiDocumentService.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');

    const filePath = `.${doc.fileUrl}`;
    try {
      unlinkSync(filePath);
    } catch (err) {
      console.warn(`File not found on disk: ${filePath}`);
    }

    return this.mpiDocumentService.remove(id);
  }
}
