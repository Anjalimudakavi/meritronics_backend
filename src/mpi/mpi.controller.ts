import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MpiService } from './mpi.service';
import { CreateMpiDto,UpdateMpiDto } from './dto/mpi.dto';
import { CHECKLIST_TEMPLATE } from './template/checklist-template';
import { OrderType, FileAction } from '@prisma/client';



@Controller('mpi')
export class MpiController {
  constructor(private readonly mpiService: MpiService) {}
  @Get('checklist-template')
  getChecklistTemplate() {
    return CHECKLIST_TEMPLATE;
  }

  @Post()
  create(@Body() createMpiDto: CreateMpiDto) {
    return this.mpiService.create(createMpiDto);
  }
@Get('enums')
getEnums() {
  return {
    orderTypes: Object.values(OrderType),
    fileActions: Object.values(FileAction),
  };
}

  @Get()
  findAll() {
    return this.mpiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mpiService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMpiDto: UpdateMpiDto) {
    return this.mpiService.update(id, updateMpiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mpiService.remove(id);
  }
}
