import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const down = async () => {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE users`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
};

const up = async () => {
  await prisma.users.createMany({
    data: [
      {
        id: uuidv4(),
        name: "Superadmin",
        username: "superadmin",
        email: "superadmin@email.com",
        password: "$2a$12$FzZC/3mX23SoxT5y1QJxz.lWQCu9FEXQ6yBg9iHqptzMF8DfdpGlK",
        image_path: null,
        role_id: 1,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      }
    ]
  });
};

export default { down, up };