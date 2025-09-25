

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto'; // Adjust the import path as necessary

@Injectable()
export class AuthorizationService {
    constructor(private readonly prisma: PrismaService) { }

//role creation
async createRole(dto: CreateRoleDto) {
  const { name, description, departmentId, createdBy, permissionIds } = dto;

  const roleExists = await this.prisma.role.findUnique({ where: { name } });
  if (roleExists) throw new Error(`Role "${name}" already exists.`);

  const data: any = {
    name,
    description,
    createdBy,
    ...(departmentId && { department: { connect: { id: departmentId } } }),
    ...(permissionIds && {
      permissions: {
        create: permissionIds.map((id) => ({
          permission: { connect: { id } },
        })),
      },
    }),
  };

  return this.prisma.role.create({
    data,
    include: {
      department: true,
      permissions: {
        include: { permission: true },
      },
    },
  });
}

//role fetching
async getAllRoles() {
  const roles = await this.prisma.role.findMany({
    include: {
      department: {
        select: { name: true },
      },
      permissions: {
        include: {
          permission: true, 
        },
      },
    },
  });

  return roles.map(role => ({
    ...role,
    departmentName: role.department?.name ?? null,
    department: undefined, 
    permissions: role.permissions.map(p => p.permission), 
  }));
}

//fetch role by id
async getRoleById(id: string) {
  const role = await this.prisma.role.findUnique({
    where: { id },
    include: {
      department: {
        select: { name: true },
      },
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!role) {
    throw new NotFoundException(`Role with id "${id}" not found.`);
  }

  return {
    ...role,
    departmentName: role.department?.name ?? null,
    department: undefined,
    permissions: role.permissions.map(p => p.permission),
  };
}

//Update role
async updateRole(roleId: string, dto: UpdateRoleDto) {
  const role = await this.prisma.role.findUnique({ where: { id: roleId } });
  if (!role) {
    throw new NotFoundException(`Role with ID "${roleId}" not found.`);
  }

 
  if (dto.name && dto.name !== role.name) {
    const nameExists = await this.prisma.role.findUnique({ where: { name: dto.name } });
    if (nameExists) {
      throw new Error(`Role name "${dto.name}" already exists.`);
    }
  }
  const data: any = { name: dto.name, description: dto.description,isActive: dto.isActive,};
   
  if ('departmentId' in dto) {
    if (dto.departmentId === null) {
      data.department = { disconnect: true };
    } else {
      data.department = { connect: { id: dto.departmentId } };
    }
  }
  await this.prisma.role.update({ where: { id: roleId }, data });
  if (dto.permissionIds) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId } });

    await this.prisma.rolePermission.createMany({
      data: dto.permissionIds.map((permissionId) => ({ roleId, permissionId })),
    });
  }

  return this.prisma.role.findUnique({
    where: { id: roleId },
    include: {
      department: { select: { id: true, name: true } },
      permissions: {
        select: {
          permission: {
            select: { id: true, name: true, description: true },
          },
        },
      },
    },
  });
}

//Delete role
 async deleteRoleById(roleId: string) {
  return await this.prisma.role.delete({
    where: {
      id: roleId,
    },
  });
}


//''''''''''''''''''''''''''''''''''''''''PERMISSIONS'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

// Create a new permission
  async createPermission( name: string, description?: string) {
    return await this.prisma.permission.create({
      data: {
        name: name,
        description: description || null,
        isActive: true,
      },
    });
  }
 
//Fetch all permissions
 async getAllPermissions() {
   return await this.prisma.permission.findMany();
    }

//Delete permission
 async deletePermissionById(permissionId: string) {
  return await this.prisma.permission.delete({
    where: {
      id:permissionId,
    },
  });
}
  
// Fetch permissions for a designation
async getPermissionsForDesignation(designationId: string) {
  return await this.prisma.designationPermission.findMany({
    where: { designationId },
    select: {
      designation: {
        select: {
          id: true,
        },
      },
      permission: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
}


//Fetch permissions for role
async getPermissionsForRole(roleId: string) {
  return await this.prisma.rolePermission.findMany({
    where: { roleId },
    select: {
      role: {
        select: {
          id:true,
          name: true,
        },
      },
      permission: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
}
}