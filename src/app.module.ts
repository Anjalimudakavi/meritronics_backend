import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StationModule } from './station/station.module';
import { SpecificationModule } from './specification/specification.module';
import { PrismaModule } from 'prisma/prisma.module';
import { MpiModule } from './mpi/mpi.module';
import { StationSpecificationModule } from './station-specification/station-specification.module';
import { ChangeOrderModule } from './change-order/change-order.module';
import { MpiDocumentModule } from './mpi-document/mpi-document.module';
@Module({
  imports: [PrismaModule,StationModule, SpecificationModule, MpiModule, StationSpecificationModule, ChangeOrderModule, MpiDocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
