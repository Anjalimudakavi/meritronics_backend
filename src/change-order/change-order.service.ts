
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import { CreateChangeOrderDto, UpdateChangeOrderDto } from './dto/change-order.dto';
// import { ChangeOrderSectionType } from '@prisma/client';

// @Injectable()
// export class ChangeOrderService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(data: CreateChangeOrderDto) {
//     return this.prisma.changeOrder.create({
//       data: {
//         section: data.section,
//         value: data.value,
//         replaceEarlier: data.replaceEarlier,
//         addRevision: data.addRevision,
//         pullFromFiles: data.pullFromFiles,
//         mpi: data.mpiId ? { connect: { id: data.mpiId } } : undefined,
//       },
//     });
//   }

//   async findAll() {
//     return this.prisma.changeOrder.findMany();
//   }

//   async findOne(id: string) {
//     const changeOrder = await this.prisma.changeOrder.findUnique({
//       where: { id },
//     });
//     if (!changeOrder) throw new NotFoundException('ChangeOrder not found');
//     return changeOrder;
//   }

//   async update(id: string, data: UpdateChangeOrderDto) {
//     const existing = await this.prisma.changeOrder.findUnique({ where: { id } });
//     if (!existing) throw new NotFoundException('ChangeOrder not found');

//     return this.prisma.changeOrder.update({
//       where: { id },
//       data: {
//         section: data.section,
//         value: data.value,
//         replaceEarlier: data.replaceEarlier,
//         addRevision: data.addRevision,
//         pullFromFiles: data.pullFromFiles,
//         mpi: data.mpiId ? { connect: { id: data.mpiId } } : undefined,
//       },
//     });
//   }

//   async remove(id: string) {
//     return this.prisma.changeOrder.delete({ where: { id } });
//   }

//   getAllSectionTypes(): string[] {
//     return Object.values(ChangeOrderSectionType);
//   }
// }

// change-order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateChangeOrderDto, UpdateChangeOrderDto } from './dto/change-order.dto';

@Injectable()
export class ChangeOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChangeOrderDto) {
    return this.prisma.changeOrder.create({
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
  }

  async findAll() {
    return this.prisma.changeOrder.findMany({ include: { detail: true } });
  }

  async findOne(id: string) {
    const changeOrder = await this.prisma.changeOrder.findUnique({
      where: { id },
      include: { detail: true },
    });
    if (!changeOrder) throw new NotFoundException('ChangeOrder not found');
    return changeOrder;
  }

  async update(id: string, data: UpdateChangeOrderDto) {
    const existing = await this.prisma.changeOrder.findUnique({
      where: { id },
      include: { detail: true },
    });
    if (!existing) throw new NotFoundException('ChangeOrder not found');

    return this.prisma.changeOrder.update({
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
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.changeOrder.delete({ where: { id } });
  }
}
