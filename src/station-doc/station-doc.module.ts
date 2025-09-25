import { Module } from '@nestjs/common';
import { DocumentationController } from './station-doc.controller';
import { DocumentationService } from './station-doc.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
   imports: [PrismaModule],
  controllers: [ DocumentationController],
  providers: [DocumentationService]
})
export class StationDocModule {}
