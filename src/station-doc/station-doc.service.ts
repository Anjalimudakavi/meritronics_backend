
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DocumentationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    fileUrl: string;
    stationId: string;
    description?: string;
    originalName?: string;
  }) {
    try {
      return await this.prisma.documentation.create({ data });
    } catch (error) {
      console.error('❌ Error creating documentation:', error);
      throw new InternalServerErrorException(`Create failed: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const doc = await this.prisma.documentation.findUnique({
        where: { id },
      });

      if (!doc) {
        throw new NotFoundException('Documentation not found');
      }

      return doc;
    } catch (error) {
      console.error(`❌ Error fetching documentation with ID ${id}:`, error);
      throw error;
    }
  }

  async findByStationId(stationId: string) {
    try {
      return await this.prisma.documentation.findMany({
        where: { stationId },
      });
    } catch (error) {
      console.error(`❌ Error fetching documentations for station ${stationId}:`, error);
      throw new InternalServerErrorException('Could not fetch station documentations');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.documentation.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`❌ Error deleting documentation with ID ${id}:`, error);
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
  }
}
