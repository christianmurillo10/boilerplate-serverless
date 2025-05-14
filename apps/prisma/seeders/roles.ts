import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const down = async () => {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE roles`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
};

const up = async () => {
  await prisma.roles.createMany({
    data: [
      {
        id: 1,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
        name: "Superadmin",
        description: "Superadmin"
      }
    ]
  });
};

export default { down, up };