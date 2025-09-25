// upload.module.ts

import { Module } from '@nestjs/common';
import { FileUploadController } from './upload.controller';
import { FileUploadService } from './upload.service';

import { StationModule } from '../station/station.module';
import { StationMpiDocsModule } from '../station-mpi-docs/station-mpi-docs.module';
import { MpiDocumentModule } from '../mpi-document/mpi-document.module';

@Module({
  imports: [
    StationModule,
    StationMpiDocsModule,
    MpiDocumentModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class UploadModule {}
