import { Module } from '@nestjs/common';
import { StationSpecificationController } from './station-specification.controller';
import { StationSpecificationService } from './station-specification.service';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
       imports: [PrismaModule], 

  controllers: [StationSpecificationController],
  providers: [StationSpecificationService, PrismaService],
})
export class StationSpecificationModule {}
