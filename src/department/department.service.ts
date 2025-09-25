
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto,UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: dto,
    });
  }

  

  async findAll() {
  return this.prisma.department.findMany({
    include: {
      roles: true,
      designations: {
        include: {
           permissions: {
            include: {
              permission: true, 
            },
          }, 
        },
      },
    },
  });
}

async findOne(id: string) {
  const department = await this.prisma.department.findUnique({
    where: { id },
    include: {
      roles: true,
      designations: {
        include: {
           permissions: {
            include: {
              permission: true,
            },
          }, 
        },
      },
    },
  });
  if (!department) throw new NotFoundException('Department not found');
  return department;
}


  async update(id: string, dto: UpdateDepartmentDto) {
    await this.findOne(id); // ensure exists
    return this.prisma.department.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.department.delete({
      where: { id },
    });
  }
}