import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FlowchartService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    fileUrl: string;
    stationId: string;
    description?: string;
    originalName?: string;
  }) {
    return this.prisma.flowchart.create({ data });
  }

  findOne(id: string) {
    return this.prisma.flowchart.findUnique({ where: { id } });
  }

  findByStationId(stationId: string) {
    return this.prisma.flowchart.findMany({ where: { stationId } });
  }

  remove(id: string) {
    return this.prisma.flowchart.delete({ where: { id } });
  }
}
