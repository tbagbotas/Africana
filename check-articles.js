require("dotenv").config({path:".env"});
const {PrismaClient}=require("@prisma/client");

const p=new PrismaClient();

p.article.findMany({
  select:{
    id:true,
    title:true,
    slug:true,
    subtitle:true,
    excerpt:true
  }
})
.then(rows => console.log(JSON.stringify(rows,null,2)))
.catch(err => console.error(err.message))
.finally(() => p.$disconnect());
