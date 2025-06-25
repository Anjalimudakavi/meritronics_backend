// // src/specification/specification.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import {
//   CreateSpecificationDto,
//   UpdateSpecificationDto,
// } from './dto/specification.dto';

// @Injectable()
// export class SpecificationService {
//   constructor(private prisma: PrismaService) {}

//   async create(dto: CreateSpecificationDto) {
//     return this.prisma.specification.create({ data: dto });
//   }

//   async findAll() {
//     return this.prisma.specification.findMany({
//       include: { station: true },
//     });
//   }

//   async findOne(id: string) {
//     const spec = await this.prisma.specification.findUnique({ where: { id } });
//     if (!spec) throw new NotFoundException('Specification not found');
//     return spec;
//   }

//   async update(id: string, dto: UpdateSpecificationDto) {
//     return this.prisma.specification.update({ where: { id }, data: dto });
//   }

//   async remove(id: string) {
//     return this.prisma.specification.delete({ where: { id } });
//   }
// }


// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import {
//   CreateSpecificationDto,
//   UpdateSpecificationDto,
// } from './dto/specification.dto';
// import { inputType as InputType } from '@prisma/client';

// @Injectable()
// export class SpecificationService {
//   constructor(private prisma: PrismaService) {}

//   private slugify(text: string): string {
//     return text
//       .toLowerCase()
//       .trim()
//       .replace(/[\s\W-]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//   }

//   async create(dto: CreateSpecificationDto) {
//     const slug = this.slugify(dto.name);
//     const type = InputType[dto.inputType as keyof typeof InputType];

//     if (!type) {
//       throw new BadRequestException(`Invalid input type: ${dto.inputType}`);
//     }

//     // Validation logic
//     if (type === InputType.DROPDOWN) {
//       if (!dto.suggestions || dto.suggestions.length === 0) {
//         throw new BadRequestException('DROPDOWN type requires suggestions.');
//       }
//     } else {
//       dto.suggestions = [];
//     }

//     if (type === InputType.CHECKBOX && dto.required === undefined) {
//       throw new BadRequestException('CHECKBOX type requires "required" flag.');
//     }

//     return this.prisma.specification.create({
//       data: {
//         name: dto.name,
//         slug,
//         inputType: type,
//         suggestions: dto.suggestions,
//         required: dto.required ?? false,
//         stationId: dto.stationId,
//       },
//     });
//   }

//   async findAll() {
//     return this.prisma.specification.findMany({
//       include: { station: true },
//     });
//   }

//   async findOne(id: string) {
//     const spec = await this.prisma.specification.findUnique({
//       where: { id },
//       include: { station: true },
//     });

//     if (!spec) throw new NotFoundException('Specification not found');
//     return spec;
//   }

//   async update(id: string, dto: UpdateSpecificationDto) {
//     const updateData: any = { ...dto };

//     if (dto.name) {
//       updateData.slug = this.slugify(dto.name);
//     }

//     if (dto.inputType) {
//       const type = InputType[dto.inputType as keyof typeof InputType];

//       if (type === InputType.DROPDOWN) {
//         if (!dto.suggestions || dto.suggestions.length === 0) {
//           throw new BadRequestException('DROPDOWN type requires suggestions.');
//         }
//       } else {
//         updateData.suggestions = [];
//       }

//       if (type === InputType.CHECKBOX && dto.required === undefined) {
//         throw new BadRequestException('CHECKBOX type requires "required" flag.');
//       }
//     }

//     return this.prisma.specification.update({
//       where: { id },
//       data: updateData,
//     });
//   }

//   async remove(id: string) {
//     return this.prisma.specification.delete({ where: { id } });
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSpecificationDto, UpdateSpecificationDto } from './dto/specification.dto';

@Injectable()
export class SpecificationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSpecificationDto) {
    return this.prisma.specification.create({ data: dto });
  }

  async findAll() {
    return this.prisma.specification.findMany({
      include: { station: true, stationSpecifications: true },
    });
  }

  async findOne(id: string) {
    const spec = await this.prisma.specification.findUnique({
      where: { id },
      include: { station: true, stationSpecifications: true },
    });
    if (!spec) throw new NotFoundException('Specification not found');
    return spec;
  }

  async update(id: string, dto: UpdateSpecificationDto) {
    return this.prisma.specification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.specification.delete({ where: { id } });
  }
}
