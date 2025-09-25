
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




