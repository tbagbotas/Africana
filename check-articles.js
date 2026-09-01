/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env" });

const { PrismaClient } = require("@prisma/client");

const p = new PrismaClient();

p.article
  .findUnique({
    where: {
      id: 28,
    },
    select: {
      id: true,
      title: true,
      image: true,
    },
  })
  .then((article) => {
    console.log(JSON.stringify(article, null, 2));
  })
  .catch((err) => {
    console.error(err.message);
  })
  .finally(() => {
    p.$disconnect();
  });