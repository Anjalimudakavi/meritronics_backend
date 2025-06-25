import { Module } from '@nestjs/common';
import { SpecificationController } from './specification.controller';
import { SpecificationService } from './specification.service';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
       imports: [PrismaModule],
  controllers: [SpecificationController],
  providers: [SpecificationService]
})
export class SpecificationModule {}
