import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('MpiService not found');
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const exists = await this.prisma.service.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('MpiService not found');

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.service.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Service not found');

    return this.prisma.service.delete({ where: { id } });
  }
}
