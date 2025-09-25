
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from './dto/specification.dto';

@Injectable()
export class SpecificationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSpecificationDto) {
    try {
      return await this.prisma.specification.create({ data: dto });
    } catch (error) {
      console.error('❌ Error creating specification:', error);
      throw new InternalServerErrorException(`Create failed: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.specification.findMany({
        include: { station: true, stationSpecifications: true },
      });
    } catch (error) {
      console.error('❌ Error fetching specifications:', error);
      throw new InternalServerErrorException('Could not fetch specifications');
    }
  }

  async findOne(id: string) {
    try {
      const spec = await this.prisma.specification.findUnique({
        where: { id },
        include: { station: true, stationSpecifications: true },
      });

      if (!spec) throw new NotFoundException('Specification not found');
      return spec;
    } catch (error) {
      console.error(`❌ Error finding specification with ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateSpecificationDto) {
    try {
      return await this.prisma.specification.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      console.error(`❌ Error updating specification with ID ${id}:`, error);
      throw new InternalServerErrorException(`Update failed: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.specification.delete({ where: { id } });
    } catch (error) {
      console.error(`❌ Error deleting specification with ID ${id}:`, error);
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
  }
}
