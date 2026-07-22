require("dotenv/config");

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
  const task = await prisma.task.upsert({
    where: {
      id: 1,
    },
    update: {
      text: "Tarea de ejemplo para pruebas",
      completed: false,
    },
    create: {
      id: 1,
      text: "Tarea de ejemplo para pruebas",
      completed: false,
    },
  });

  console.log("Seed ejecutado correctamente:", task);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error ejecutando el seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });