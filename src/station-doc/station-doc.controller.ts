

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  Delete,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { unlinkSync } from 'fs';
import { Response } from 'express';
import { DocumentationService } from './station-doc.service';

@Controller('station-documentations')
export class DocumentationController {
  constructor(private readonly documentationService: DocumentationService) {}

  // Upload station documentation files
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/station-documentations',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}${extname(file.originalname)}`;
          console.log('Saving file as:', filename);
          cb(null, filename);
        },
      }),
    }),
  )
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { stationId: string; description?: string },
  ) {
    console.log('Received upload request:', body, files.length, 'files');

    if (!body.stationId) {
      console.error('stationId missing in upload');
      throw new BadRequestException('stationId is required');
    }

    const createdDocs = await Promise.all(
      files.map(file => {
        const docData = {
          stationId: body.stationId,
          description: body.description || file.originalname,
          originalName: file.originalname,
          fileUrl: `http://54.177.111.218:4000/uploads/station-documentations/${file.filename}`,
        };
        console.log('Creating doc entry:', docData);
        return this.documentationService.create(docData);
      }),
    );

    return createdDocs;
  }

  // Get single documentation by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('Fetching documentation with ID:', id);
    const doc = await this.documentationService.findOne(id);
    if (!doc) {
      console.error('Documentation not found for ID:', id);
      throw new NotFoundException('Documentation not found');
    }
    return doc;
  }

  // Get all documentation for a specific station
  @Get('by-station/:stationId')
  async findByStation(@Param('stationId') stationId: string) {
    console.log('Fetching documentation for station:', stationId);
    return this.documentationService.findByStationId(stationId);
  }

  // Download a documentation file
  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    console.log('Download requested for ID:', id);
    const doc = await this.documentationService.findOne(id);
    if (!doc || !doc.fileUrl) {
      console.error('Documentation not found or fileUrl missing for ID:', id);
      throw new NotFoundException('Documentation not found');
    }

    const filePath = join(process.cwd(), doc.fileUrl.replace('http://54.177.111.218:4000', '.'));
    const downloadName = doc.originalName || `documentation-${id}${extname(filePath)}`;
    console.log('Downloading file from path:', filePath);

    return res.download(filePath, downloadName);
  }

  // Delete a documentation
  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('Delete request for documentation ID:', id);
    const doc = await this.documentationService.findOne(id);
    if (!doc) {
      console.error('Documentation not found for deletion:', id);
      throw new NotFoundException('Documentation not found');
    }

    try {
      if (!doc.fileUrl) {
        console.error('File URL missing in doc for deletion');
        throw new NotFoundException('File URL is missing');
      }

      const localPath = doc.fileUrl.replace('http://54.177.111.218:4000', '.');
      console.log('Attempting to delete file from path:', localPath);
      unlinkSync(localPath);
    } catch (err) {
      console.warn(`⚠ File not found or error while deleting: ${doc.fileUrl}`, err);
    }

    console.log('Removing doc entry from DB...');
    return this.documentationService.remove(id);
  }
}

