

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
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { Response } from 'express';
import { MpiDocumentService } from './mpi-document.service';

@Controller('mpi-document')
export class MpiDocumentController {
  constructor(private readonly mpiDocumentService: MpiDocumentService) {}

  // ✅ CREATE / Upload file
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
    const fileUrl = `http://54.177.111.218:4000/uploads/mpidocs/${file.filename}`;
    const originalName = file.originalname;

    return this.mpiDocumentService.create({
      fileUrl,
      description,
      mpiId,
      originalName,
    });
  }

  // ✅ DOWNLOAD by ID (fixed path resolution)
  @Get(':id/download')
  async downloadById(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.mpiDocumentService.findOne(id);
    if (!doc || !doc.fileUrl) {
      throw new NotFoundException('MPI document not found');
    }

    const fileName = doc.fileUrl.split('/').pop() || ''; // extract just the filename, fallback to empty string
    const filePath = join(process.cwd(), 'uploads', 'mpidocs', fileName); // correct local path

    const downloadName = doc.originalName || `mpi-document-${id}${extname(fileName)}`;
    return res.download(filePath, downloadName);
  }

  // ✅ READ ALL
  @Get()
  async findAll() {
    return this.mpiDocumentService.findAll();
  }

  // ✅ READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.mpiDocumentService.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  // ✅ UPDATE description
  @Patch(':id')
  async update(@Param('id') id: string, @Body('description') description: string) {
    return this.mpiDocumentService.update(id, { description });
  }

  // ✅ DELETE (fixed file unlink path)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const doc = await this.mpiDocumentService.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');

    if (!doc.fileUrl) {
      throw new NotFoundException('File URL not found for this document');
    }
    const fileName = doc.fileUrl.split('/').pop() || ''; // extract filename
    const filePath = join(process.cwd(), 'uploads', 'mpidocs', fileName); // correct local path

    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (err) {
      console.warn(`Failed to delete file: ${filePath}`);
    }

    return this.mpiDocumentService.remove(id);
  }
}
