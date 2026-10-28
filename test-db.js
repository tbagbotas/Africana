import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(JSON.stringify(articles, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });