
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateChangeOrderDto, UpdateChangeOrderDto } from './dto/change-order.dto';

@Injectable()
export class ChangeOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChangeOrderDto) {
    try {
      return await this.prisma.changeOrder.create({
        data: {
          changeorder_name: data.changeorder_name,
          mpiId: data.mpiId,
          detail: {
            create: {
              isRequired: data.detail.isRequired,
              description: data.detail.description,
              replaceEarlier: data.detail.replaceEarlier ?? false,
              addRevision: data.detail.addRevision ?? false,
              pullFromFiles: data.detail.pullFromFiles,
            },
          },
        },
        include: { detail: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create ChangeOrder', error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.changeOrder.findMany({ include: { detail: true } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve ChangeOrders', error.message);
    }
  }

  async findOne(id: string) {
    try {
      const changeOrder = await this.prisma.changeOrder.findUnique({
        where: { id },
        include: { detail: true },
      });
      if (!changeOrder) throw new NotFoundException('ChangeOrder not found');
      return changeOrder;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to retrieve ChangeOrder', error.message);
    }
  }

  async update(id: string, data: UpdateChangeOrderDto) {
    try {
      const existing = await this.prisma.changeOrder.findUnique({
        where: { id },
        include: { detail: true },
      });
      if (!existing) throw new NotFoundException('ChangeOrder not found');

      return await this.prisma.changeOrder.update({
        where: { id },
        data: {
          changeorder_name: data.changeorder_name,
          mpiId: data.mpiId,
          detail: data.detail
            ? {
                update: {
                  isRequired: data.detail.isRequired,
                  description: data.detail.description,
                  replaceEarlier: data.detail.replaceEarlier,
                  addRevision: data.detail.addRevision,
                  pullFromFiles: data.detail.pullFromFiles,
                },
              }
            : undefined,
        },
        include: { detail: true },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update ChangeOrder', error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id); // Ensure it exists
      return await this.prisma.changeOrder.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete ChangeOrder', error.message);
    }
  }
}
