

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { unlinkSync } from 'fs';
import { Response } from 'express';
import { StationMpiDocumentService } from './station-mpi-docs.service';
import { Express } from 'express';

@Controller('station-mpi-documents')
export class StationMpiDocumentController {
  constructor(private readonly stationMpiDocService: StationMpiDocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/station-mpi-docs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: {
      stationId: string;
      description?: string;
      mpiId?: string;
    },
  ) {
    if (!body.stationId) {
      throw new BadRequestException('stationId is required');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }
   
    try {
      const createdDocs = await Promise.all(
        files.map(async (file) => {
          const fileUrl = `http://54.177.111.218:4000/uploads/station-mpi-docs/${file.filename}`;

          const docData = {
            fileUrl,
            stationId: body.stationId,
            description: body.description || file.originalname,
            originalName: file.originalname,
            ...(body.mpiId && { mpiId: body.mpiId }),
          };

          return this.stationMpiDocService.create(docData);
        }),
      );

      console.log(`✅ Successfully uploaded ${createdDocs.length} station documents`);
      return createdDocs;

    } catch (error) {
      console.error('❌ Station document upload failed:', error);

      // Clean up uploaded files
      files.forEach(file => {
        try {
          unlinkSync(file.path);
        } catch (cleanupError) {
          console.warn('⚠ Failed to cleanup file:', file.path);
        }
      });

      throw error;
    }
  }

  @Get()
  async findAll() {
    return this.stationMpiDocService.findAll();
  }

  @Get('by-mpi/:mpiId')
  async findByMpiId(@Param('mpiId') mpiId: string) {
    return this.stationMpiDocService.findByMpiId(mpiId);
  }

  @Get('by-station/:stationId')
  async findByStationId(@Param('stationId') stationId: string) {
    return this.stationMpiDocService.findByStationId(stationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.stationMpiDocService.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  // ✅ Download with original filename fallback
  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.stationMpiDocService.findOne(id);
    if (!doc || !doc.fileUrl) {
      throw new NotFoundException('File not found');
    }

    const filePath = join(process.cwd(), doc.fileUrl.replace('http://54.177.111.218:4000', '.'));
    const downloadName = doc.originalName || `station-mpi-document-${id}${extname(filePath)}`;

    
    return res.download(filePath, downloadName);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: {
      description?: string;
      mpiId?: string;
    }
  ) {
    return this.stationMpiDocService.update(id, updateData);
  }

  @Patch(':id/link-mpi')
  async linkToMpi(@Param('id') id: string, @Body('mpiId') mpiId: string) {
    if (!mpiId) throw new BadRequestException('mpiId is required');
    return this.stationMpiDocService.update(id, { mpiId });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const doc = await this.stationMpiDocService.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');

    try {
      const localPath = doc.fileUrl.replace('http://54.177.111.218:4000', '.');
      unlinkSync(localPath);
    } catch (err) {
      console.warn(`⚠ File not found on disk: ${doc.fileUrl}`);
    }

    return this.stationMpiDocService.remove(id);
  }
}
