import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { StationService } from './station.service';

@Controller('stations')
export class StationController {
  constructor(private readonly service: StationService) {}

  // ✅ Create a station (without files here)
  @Post()
  create(@Body() dto: CreateStationDto) {
    console.log('Creating station with DTO:', dto);
    return this.service.create(dto);
  }

  // ✅ Get all stations
  @Get()
  findAll() {
    console.log('Fetching all stations');
    return this.service.findAll();
  }

  // ✅ Get a single station
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('Fetching station with ID:', id);
    return this.service.findOne(id);
  }

  // ✅ Update a station
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStationDto) {
    console.log('Updating station with ID:', id, 'Data:', dto);
    return this.service.update(id, dto);
  }

  // ✅ Delete a station
  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('Deleting station with ID:', id);
    return this.service.remove(id);
  }
}
