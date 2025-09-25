

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MpiDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE with optional originalName
  async create(data: {
    fileUrl: string;
    originalName?: string;
    description?: string;
    mpiId: string;
  }) {
    try {
      return await this.prisma.mpiDocumentation.create({
        data: {
          fileUrl: data.fileUrl,
          originalName: data.originalName ?? null,
          description: data.description,
          mpiId: data.mpiId,
        },
      });
    } catch (error) {
      console.error('❌ Error creating MPI document:', error);
      throw new InternalServerErrorException(`Create failed: ${error.message}`);
    }
  }

  // ✅ READ ALL
  async findAll() {
    try {
      return await this.prisma.mpiDocumentation.findMany();
    } catch (error) {
      console.error('❌ Error fetching MPI documents:', error);
      throw new InternalServerErrorException('Could not fetch documents');
    }
  }

  // ✅ READ ONE
  async findOne(id: string) {
    try {
      const doc = await this.prisma.mpiDocumentation.findUnique({
        where: { id },
      });

      if (!doc) throw new NotFoundException('MPI Document not found');
      return doc;
    } catch (error) {
      console.error(`❌ Error fetching MPI document with ID ${id}:`, error);
      throw error;
    }
  }

  // ✅ UPDATE description
  async update(id: string, data: { description: string }) {
    try {
      return await this.prisma.mpiDocumentation.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`❌ Error updating MPI document with ID ${id}:`, error);
      throw new InternalServerErrorException(`Update failed: ${error.message}`);
    }
  }

  // ✅ DELETE
  async remove(id: string) {
    try {
      return await this.prisma.mpiDocumentation.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`❌ Error deleting MPI document with ID ${id}:`, error);
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
  }
}
