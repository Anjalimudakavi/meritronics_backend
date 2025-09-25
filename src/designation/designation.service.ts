

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDesignationDto, UpdateDesignationDto } from './dto/designation.dto';

@Injectable()
export class DesignationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDesignationDto) {
    const { permissionIds = [], ...designationData } = dto;

    return this.prisma.designation.create({
      data: {
        ...designationData,
        isActive: dto.isActive ?? true,
        permissions: permissionIds.length
          ? {
              create: permissionIds.map((id) => ({
                permission: { connect: { id } },
              })),
            }
          : undefined,
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.designation.findMany({
      include: {
        department: true,
        role: true,
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const designation = await this.prisma.designation.findUnique({
      where: { id },
      include: {
        department: true,
        role: true,
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    if (!designation) throw new NotFoundException('Designation not found');
    return designation;
  }


  async update(id: string, dto: UpdateDesignationDto) {
  const { permissionIds, ...rest } = dto;

  await this.prisma.$transaction([
    this.prisma.designation.update({
      where: { id },
      data: rest,
    }),

    ...(permissionIds
      ? [
          this.prisma.designationPermission.deleteMany({
            where: { designationId: id },
          }),
          this.prisma.designationPermission.createMany({
            data: permissionIds.map((permissionId) => ({
              designationId: id,
              permissionId,
            })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  // Return updated designation with permissions
  return this.findOne(id); // ✅ return full updated entity
}


  async remove(id: string) {
    return this.prisma.designation.delete({
      where: { id },
    });
  }
}
