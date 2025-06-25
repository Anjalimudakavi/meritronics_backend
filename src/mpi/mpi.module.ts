import { Module } from '@nestjs/common';
import { MpiService } from './mpi.service';
import { MpiController } from './mpi.controller';

import { PrismaModule } from 'prisma/prisma.module';
@Module({
       imports: [PrismaModule],
  controllers: [MpiController],
  providers: [MpiService],
})
export class MpiModule {}
