import { Module } from '@nestjs/common';
import { FlowchartController } from './station-flowchart.controller';
import { FlowchartService } from './station-flowchart.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
   imports: [PrismaModule],
  controllers: [FlowchartController],
  providers: [FlowchartService]
})
export class StationFlowchartModule {}
