import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
  // 1. Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 2. Fetch firstName, lastName, email, and roleId from employee
  const employee = await this.prisma.employee.findUnique({
    where: { id: data.employeeId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      roleId: true,
    },
  });

  if (!employee) {
    throw new NotFoundException(`Employee with ID ${data.employeeId} not found`);
  }
  const fullName = `${employee.firstName} ${employee.lastName}`;
  // 3. Create user using combined full name and other employee info
  return this.prisma.user.create({
    data: {
      employeeId: data.employeeId, 
      name: fullName,
      email: employee.email,
      roleId: employee.roleId,
      password: hashedPassword,
      username: data.username, // Provide from DTO
      // phone: data.phone,       // Provide from DTO
      phone: data.phone ?? undefined,

    },
  });
}


  async findAll() {
  return this.prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      employee: {
        include: {
          role: true,
        },
      },
    },
  });
}

async getUserByEmail(email: string) {
  return this.prisma.user.findFirst({
    where: {
      email: {
        contains: email,
        mode: 'insensitive',
      },
    },
    include: {
      employee: {
        include: {
          role: true,
          designation: {
            include: {
              permissions: {
                include: {
                  permission: true, // fetch the actual permission details
                },
              },
            },
          },
        },
      },
    },
  });
}


  //Fetch user by ID
  async getUserById(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      role: true, 
    },
  });

  if (!user) throw new NotFoundException('User not found');
  return user;
}

//update customer 
 async updateUser(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  //Delete customer 
  async delete(id: string) {
    await this.getUserById(id); // This ensures NotFoundException if user doesn't exist
    return this.prisma.user.delete({
      where: { id },
    });
  }
}