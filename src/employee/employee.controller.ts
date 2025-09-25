// employee.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body,Patch, Req, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';


@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
async create(@Body() dto: CreateEmployeeDto) {
  return this.employeeService.create(dto); 
}

  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}