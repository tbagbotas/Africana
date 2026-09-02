/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log("\n=== AFRICANA ADMIN ACCOUNT ===\n");

  const name = await ask("Admin name: ");
  const email = await ask("Admin email: ");
  const password = await ask("Admin password: ");

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password.trim()) {
    console.log("\nEmail and password are required.");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
  });

  if (existingUser) {
    console.log("\nA user with this email already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim() || "Africana Admin",
      email: cleanEmail,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("\nAdmin account created successfully!");
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
}

main()
  .catch((error) => {
    console.error("\nError creating admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    rl.close();
  });