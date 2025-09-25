import { Module } from '@nestjs/common';
import { ChangeOrderController } from './change-order.controller';
import { ChangeOrderService } from './change-order.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
      imports: [PrismaModule],
  controllers: [ChangeOrderController],
  providers: [ChangeOrderService]
})
export class ChangeOrderModule {}
