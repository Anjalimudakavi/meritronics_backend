import { PrismaClient, Permission } from '@prisma/client';
const bcrypt = require('bcryptjs'); // CommonJS-safe

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Seed permissions
  const permissionsData = [
    { name: 'View', description: 'Allows viewing employee records' },
    { name: 'Edit', description: 'Allows edit' },
    { name: 'Delete', description: 'Allows delete' },
  ];

  const permissions: Permission[] = [];
  for (const perm of permissionsData) {
    const p = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    permissions.push(p);
  }

  // 2️⃣ Create Admin Role
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrator role with all permissions',
    },
  });

  // Link all permissions to Admin role
  for (const perm of permissions) {
    const exists = await prisma.rolePermission.findFirst({
      where: { roleId: adminRole.id, permissionId: perm.id },
    });
    if (!exists) {
      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  // 3️⃣ Create Employee + User
  const dummyEmployee = {
    firstName: 'Mpi',
    lastName: 'Admin',
    email: 'mpi@meritronics.com',
    phone: '9999999999',
    roleId: adminRole.id,
    isActive: true,
  };

  const employee = await prisma.employee.upsert({
    where: { email: dummyEmployee.email },
    update: {}, // do nothing if already exists
    create: {
      ...dummyEmployee,
      user: {
        create: {
          username: 'mpi',
          password: await bcrypt.hash('mpi@meritronics', 10),
          email: dummyEmployee.email,
          roleId: adminRole.id,
          phone: dummyEmployee.phone,
          name: `${dummyEmployee.firstName} ${dummyEmployee.lastName}`,
        },
      },
    },
  });

  // Ensure user.employeeId is correct
  await prisma.user.update({
    where: { email: dummyEmployee.email },
    data: { employeeId: employee.id },
  });

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
