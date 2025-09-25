import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';


@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}


async create(dto: CreateEmployeeDto) {
  const { user, email, phone, ...employeeData } = dto;

  let userWithHashedPassword: Prisma.UserCreateNestedOneWithoutEmployeeInput | undefined = undefined;

  if (user?.username) {
    if (!user.password) {
      throw new Error("Password is required when username is provided.");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    userWithHashedPassword = {
      create: {
        username: user.username,
        password: hashedPassword,
        roleId: user.roleId,
        email, // synced from employee
        // phone, // synced from employee
         ...(phone && { phone }),
      },
    };
  }

  return this.prisma.employee.create({
    data: {
      ...employeeData,
      email,
      phone,
      user: userWithHashedPassword, // will be undefined if no username
    },
    include: {
      user: {
        include: { role: true },
      },
      role: true,
      designation: true,
    },
  });
}



  async findAll() {
    return this.prisma.employee.findMany({
      include: {
        user: {
          include: { role: true }, // role through user
        },
        role: true, 
         designation: true,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          include: { role: true },
        },
        role: true,
         designation: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  // async update(id: string, dto: UpdateEmployeeDto) {
  //   await this.findOne(id); // ensure exists

  //   return this.prisma.employee.update({
  //     where: { id },
  //     data: { ...dto },
  //   });
  // }

async update(id: string, dto: UpdateEmployeeDto) {

  const {
    user, email, phone,
    ...employeeData
  } = dto;

  let userUpdateData: Prisma.UserUpdateInput | undefined = undefined;

  if (user) {
    const { password, ...restUserData } = user;

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    userUpdateData = {
      ...restUserData,
      ...(hashedPassword && { password: hashedPassword }),
      ...(email && { email }), // sync from employee dto
      ...(phone && { phone }),
    };
  }

  return this.prisma.employee.update({
    where: { id },
    data: {
      ...employeeData,
      ...(email && { email }),
      ...(phone && { phone }),
      ...(userUpdateData && {
        user: {
          update: userUpdateData,
        },
      }),
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
      role: true,
      designation: true,
    },
  });
}


  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
