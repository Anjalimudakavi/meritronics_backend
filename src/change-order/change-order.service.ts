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
//         briefDescription: data.briefDescription,
//         mpi: { connect: { id: data.mpiId } },
//         sections: {
//           create: data.sections.map((section) => ({
//             section: section.section,
//             value: section.value,
//             replaceEarlier: section.replaceEarlier,
//             addRevision: section.addRevision,
//             pullFromFiles: section.pullFromFiles,
//           })),
//         },
//       },
//       include: {
//         sections: true,
//       },
//     });
//   }

//   async findAll() {
//     return this.prisma.changeOrder.findMany({
//       include: { sections: true },
//     });
//   }

//   async findOne(id: string) {
//     const changeOrder = await this.prisma.changeOrder.findUnique({
//       where: { id },
//       include: { sections: true },
//     });
//     if (!changeOrder) throw new NotFoundException('ChangeOrder not found');
//     return changeOrder;
//   }

//   async update(id: string, data: UpdateChangeOrderDto) {
//     const existing = await this.prisma.changeOrder.findUnique({ where: { id } });
//     if (!existing) throw new NotFoundException('ChangeOrder not found');

//     // Remove existing sections and re-create (you can optimize this if needed)
//     await this.prisma.changeOrderSection.deleteMany({ where: { changeOrderId: id } });

//     return this.prisma.changeOrder.update({
//       where: { id },
//       data: {
//         briefDescription: data.briefDescription,
//         mpi: data.mpiId ? { connect: { id: data.mpiId } } : undefined,
//         sections: data.sections
//           ? {
//               create: data.sections.map((section) => ({
//                 section: section.section,
//                 value: section.value,
//                 replaceEarlier: section.replaceEarlier,
//                 addRevision: section.addRevision,
//                 pullFromFiles: section.pullFromFiles,
//               })),
//             }
//           : undefined,
//       },
//       include: { sections: true },
//     });
//   }

//   async remove(id: string) {
//     await this.prisma.changeOrderSection.deleteMany({ where: { changeOrderId: id } });
//     return this.prisma.changeOrder.delete({ where: { id } });
//   }

//   getAllSectionTypes(): string[] {
//     return Object.values(ChangeOrderSectionType);
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateChangeOrderDto, UpdateChangeOrderDto } from './dto/change-order.dto';
import { ChangeOrderSectionType } from '@prisma/client';

@Injectable()
export class ChangeOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChangeOrderDto) {
    return this.prisma.changeOrder.create({
      data: {
        section: data.section,
        value: data.value,
        replaceEarlier: data.replaceEarlier,
        addRevision: data.addRevision,
        pullFromFiles: data.pullFromFiles,
        mpi: data.mpiId ? { connect: { id: data.mpiId } } : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.changeOrder.findMany();
  }

  async findOne(id: string) {
    const changeOrder = await this.prisma.changeOrder.findUnique({
      where: { id },
    });
    if (!changeOrder) throw new NotFoundException('ChangeOrder not found');
    return changeOrder;
  }

  async update(id: string, data: UpdateChangeOrderDto) {
    const existing = await this.prisma.changeOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('ChangeOrder not found');

    return this.prisma.changeOrder.update({
      where: { id },
      data: {
        section: data.section,
        value: data.value,
        replaceEarlier: data.replaceEarlier,
        addRevision: data.addRevision,
        pullFromFiles: data.pullFromFiles,
        mpi: data.mpiId ? { connect: { id: data.mpiId } } : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.changeOrder.delete({ where: { id } });
  }

  getAllSectionTypes(): string[] {
    return Object.values(ChangeOrderSectionType);
  }
}
