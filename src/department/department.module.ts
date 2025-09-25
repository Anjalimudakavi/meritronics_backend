import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
   imports: [PrismaModule],
  providers: [DepartmentService,PrismaService],
  controllers: [DepartmentController]
})
export class DepartmentModule {}