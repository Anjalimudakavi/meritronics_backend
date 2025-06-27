// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';

// @Injectable()
// export class MpiDocumentService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(data: { fileUrl: string; description?: string; mpiId: string }) {
//     return this.prisma.mpiDocumentation.create({
//       data,
//     });
//   }
// }


import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MpiDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { fileUrl: string; description?: string; mpiId: string }) {
    return this.prisma.mpiDocumentation.create({
      data,
    });
  }

  findAll() {
    return this.prisma.mpiDocumentation.findMany();
  }

  findOne(id: string) {
    return this.prisma.mpiDocumentation.findUnique({ where: { id } });
  }

  update(id: string, data: { description: string }) {
    return this.prisma.mpiDocumentation.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.mpiDocumentation.delete({ where: { id } });
  }
}
