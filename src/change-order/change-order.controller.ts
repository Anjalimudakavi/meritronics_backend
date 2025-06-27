// // change-order.controller.ts
// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Patch,
//   Delete,
// } from '@nestjs/common';
// import { ChangeOrderService } from './change-order.service';
// import {
//   CreateChangeOrderDto,
//   UpdateChangeOrderDto,
// } from './dto/change-order.dto';
// import { ChangeOrderSectionType } from '@prisma/client';

// @Controller('change-orders')
// export class ChangeOrderController {
//   constructor(private readonly service: ChangeOrderService) {}

//   @Post()
//   create(@Body() dto: CreateChangeOrderDto) {
//     return this.service.create(dto);
//   }

//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

//   @Get('sections')
//   getSectionTypes(): string[] {
//     return Object.values(ChangeOrderSectionType);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.service.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() dto: UpdateChangeOrderDto) {
//     return this.service.update(id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.service.remove(id);
//   }
// }



// change-order.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChangeOrderService } from './change-order.service';
import { CreateChangeOrderDto, UpdateChangeOrderDto } from './dto/change-order.dto';

@Controller('change-orders')
export class ChangeOrderController {
  constructor(private readonly changeOrderService: ChangeOrderService) {}

  @Post()
  create(@Body() dto: CreateChangeOrderDto) {
    return this.changeOrderService.create(dto);
  }

  @Get()
  findAll() {
    return this.changeOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.changeOrderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChangeOrderDto) {
    return this.changeOrderService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.changeOrderService.remove(id);
  }
}
