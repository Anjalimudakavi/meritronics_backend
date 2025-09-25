

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Logger,
} from '@nestjs/common';

import { MpiService } from './mpi.service';
import { CreateMpiDto, UpdateMpiDto } from './dto/mpi.dto';
import { CHECKLIST_TEMPLATE } from './template/checklist-template';
import { OrderType, FileAction } from '@prisma/client';

@Controller('mpi')
export class MpiController {
  private readonly logger = new Logger(MpiController.name);

  constructor(private readonly mpiService: MpiService) {}

  @Get('checklist-template')
  getChecklistTemplate() {
    return CHECKLIST_TEMPLATE;
  }

  @Get('enums')
  getEnums() {
    return {
      orderTypes: Object.values(OrderType),
      fileActions: Object.values(FileAction),
    };
  }

  @Post()
  async create(@Body() createMpiDto: CreateMpiDto) {
    try {
      this.logger.log('Creating new MPI');
      this.logger.debug('MPI DTO:', JSON.stringify(createMpiDto, null, 2));
      
      const result = await this.mpiService.create(createMpiDto);
      
      this.logger.log(`MPI created successfully with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to create MPI:', error.message);
      this.logger.error('Stack trace:', error.stack);
      throw new BadRequestException(error.message || 'Failed to create MPI');
    }
  }

  // @Post()
  // create(@Body() createMpiDto: CreateMpiDto) {
  //   return this.mpiService.create(createMpiDto);
  // }



  @Get()
  async findAll() {
    try {
      return await this.mpiService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch MPIs:', error.message);
      throw new BadRequestException('Failed to fetch MPIs');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.mpiService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch MPI ${id}:`, error.message);
      throw new BadRequestException('Failed to fetch MPI');
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMpiDto: UpdateMpiDto) {
    try {
      this.logger.log(`Updating MPI ${id}`);
      return await this.mpiService.update(id, updateMpiDto);
    } catch (error) {
      this.logger.error(`Failed to update MPI ${id}:`, error.message);
      throw new BadRequestException(error.message || 'Failed to update MPI');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting MPI ${id}`);
      return await this.mpiService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete MPI ${id}:`, error.message);
      throw new BadRequestException('Failed to delete MPI');
    }
  }
}