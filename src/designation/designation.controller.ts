import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DesignationService } from './designation.service';

import { CreateDesignationDto, UpdateDesignationDto} from './dto/designation.dto'


@Controller('designations')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
  create(@Body() dto: CreateDesignationDto) {
    return this.designationService.create(dto);
  }

  @Get()
  findAll() {
    return this.designationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDesignationDto) {
    return this.designationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.designationService.remove(id);
  }
}

