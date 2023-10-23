import { PrismaClient } from '@prisma/client';
import roles from "./roles";
import users from "./users";

const prisma = new PrismaClient();

async function main() {
  await roles.down();
  await roles.up();
  await users.down();
  await users.up();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });