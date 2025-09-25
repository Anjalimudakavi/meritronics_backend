
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
import { FlowchartService } from './station-flowchart.service';
import { PrismaService } from 'prisma/prisma.service';

@Controller('station-flowcharts')
export class FlowchartController {
  constructor(
    private readonly flowchartService: FlowchartService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/station-flowcharts',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { stationId: string; description?: string },
  ) {
    console.log('📥 Upload request received:', { body, files });

    if (!body.stationId) throw new BadRequestException('stationId is required');

    const created = await Promise.all(
      files.map((file) =>
        this.flowchartService.create({
          stationId: body.stationId,
          description: body.description || file.originalname,
          originalName: file.originalname,
          fileUrl: `http://54.177.111.218:4000/uploads/station-flowcharts/${file.filename}`,
        }),
      ),
    );

    console.log('✅ Files uploaded and flowchart entries created:', created);
    return created;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`🔍 Fetching flowchart with id: ${id}`);
    const fc = await this.flowchartService.findOne(id);
    if (!fc) {
      console.warn(`❌ Flowchart not found for id: ${id}`);
      throw new NotFoundException('Flowchart not found');
    }
    return fc;
  }

  @Get('by-station/:stationId')
  async findByStation(@Param('stationId') stationId: string) {
    console.log(`📄 Getting flowcharts for stationId: ${stationId}`);
    const list = await this.flowchartService.findByStationId(stationId);
    console.log(`✅ Found ${list.length} flowcharts for stationId: ${stationId}`);
    return list;
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    console.log(`📦 Download request for flowchart id: ${id}`);
    const fc = await this.flowchartService.findOne(id);
    if (!fc || !fc.fileUrl) {
      console.warn(`❌ Flowchart or file URL not found for id: ${id}`);
      throw new NotFoundException('Flowchart not found');
    }

    const filePath = join(process.cwd(), fc.fileUrl.replace('http://54.177.111.218:4000', '.'));
    const downloadName = fc.originalName || `flowchart-${id}${extname(filePath)}`;

    console.log(`⬇️ Sending file: ${filePath}`);
    return res.download(filePath, downloadName);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`🗑️ Deleting flowchart with id: ${id}`);
    const fc = await this.flowchartService.findOne(id);
    if (!fc) {
      console.warn(`❌ Flowchart not found for delete: ${id}`);
      throw new NotFoundException('Flowchart not found');
    }

    try {
      if (!fc.fileUrl) throw new NotFoundException('File URL is missing');
      const localPath = fc.fileUrl.replace('http://54.177.111.218:4000', '.');
      unlinkSync(localPath);
      console.log(`🧹 Deleted file from disk: ${localPath}`);
    } catch (err) {
      console.warn(`⚠️ Error while deleting file from disk: ${fc.fileUrl}`, err.message);
    }

    const result = await this.flowchartService.remove(id);
    console.log(`✅ Deleted flowchart record with id: ${id}`);
    return result;
  }
}
