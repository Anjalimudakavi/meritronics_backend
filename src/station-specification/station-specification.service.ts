

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Express } from 'express';
import { inputType as InputType } from '@prisma/client';
import {
  CreateStationSpecificationDto,
  UpdateStationSpecificationDto,
} from './dto/staion-spec.dto';

@Injectable()
export class StationSpecificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createWithFile(
    file: Express.Multer.File,
    body: CreateStationSpecificationDto,
  ) {
    const spec = await this.prisma.specification.findUnique({
      where: { id: body.specificationId },
    });

    if (!spec) {
      throw new NotFoundException('Specification not found');
    }

    if (spec.inputType !== InputType.FILE_UPLOAD) {
      throw new BadRequestException('Specification is not of type FILE_UPLOAD');
    }

    const filePath = file.path.replace(/\\/g, '/');

    return this.prisma.stationSpecification.upsert({
      where: {
        stationId_specificationId: {
          stationId: body.stationId,
          specificationId: body.specificationId,
        },
      },
      update: {
        value: filePath,
        unit: body.unit,
      },
      create: {
        stationId: body.stationId,
        specificationId: body.specificationId,
        value: filePath,
        unit: body.unit,
      },
    });
  }

  async create(data: CreateStationSpecificationDto) {
    const spec = await this.prisma.specification.findUnique({
      where: { id: data.specificationId },
    });

    if (!spec) {
      throw new NotFoundException('Specification not found');
    }

    if (spec.inputType === InputType.FILE_UPLOAD) {
      throw new BadRequestException('Use createWithFile for FILE_UPLOAD specifications');
    }

    return this.prisma.stationSpecification.upsert({
      where: {
        stationId_specificationId: {
          stationId: data.stationId,
          specificationId: data.specificationId,
        },
      },
      update: {
        value: data.value,
        unit: data.unit,
      },
      create: {
        stationId: data.stationId,
        specificationId: data.specificationId,
        value: data.value,
        unit: data.unit,
      },
    });
  }

  async findAll() {
    return this.prisma.stationSpecification.findMany({
      include: { specification: true, station: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.stationSpecification.findUnique({
      where: { id },
      include: { specification: true, station: true },
    });
  }

  async update(id: string, data: UpdateStationSpecificationDto) {
    return this.prisma.stationSpecification.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.stationSpecification.delete({
      where: { id },
    });
  }
}
