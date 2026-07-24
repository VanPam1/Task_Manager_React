require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable DATABASE_URL no está configurada.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.task.upsert({
    where: { id: 1 },
    update: {
      text: "Completar el laboratorio de DevOps",
      completed: false,
    },
    create: {
      id: 1,
      text: "Completar el laboratorio de DevOps",
      completed: false,
    },
  });

  await prisma.task.upsert({
    where: { id: 2 },
    update: {
      text: "Probar migraciones automáticas",
      completed: true,
    },
    create: {
      id: 2,
      text: "Probar migraciones automáticas",
      completed: true,
    },
  });

  await prisma.task.upsert({
    where: { id: 3 },
    update: {
      text: "Verificar GitHub Actions",
      completed: false,
    },
    create: {
      id: 3,
      text: "Verificar GitHub Actions",
      completed: false,
    },
  });

  console.log("✅ Seed ejecutado correctamente.");
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });