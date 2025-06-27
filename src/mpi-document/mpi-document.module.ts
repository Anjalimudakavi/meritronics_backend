import { Module } from '@nestjs/common';
import { MpiDocumentController } from './mpi-document.controller';
import { MpiDocumentService } from './mpi-document.service';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
         imports: [PrismaModule],
  
  controllers: [MpiDocumentController],
  providers: [MpiDocumentService]
})
export class MpiDocumentModule {}
