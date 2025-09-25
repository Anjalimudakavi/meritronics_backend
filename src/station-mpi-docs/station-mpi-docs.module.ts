import { Module } from '@nestjs/common';
import { StationMpiDocumentController } from './station-mpi-docs.controller';
import { StationMpiDocumentService } from './station-mpi-docs.service';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [StationMpiDocumentController],
  providers: [StationMpiDocumentService],
   exports: [StationMpiDocumentService],
})
export class StationMpiDocsModule {}
