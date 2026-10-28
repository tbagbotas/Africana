require("dotenv").config({path:".env"});
const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();

p.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
.then(rows => console.log(rows.map(r => r.table_name).join("\n")))
.catch(err => console.error(err.message))
.finally(() => p.$disconnect());
