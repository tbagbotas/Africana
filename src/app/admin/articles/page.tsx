import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import ArticlesClient from "./ArticlesClient";

export default async function ArticlesPage() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("africana_admin");

  if (!adminCookie?.value) {
    redirect("/admin/login");
  }

  const userId = Number(adminCookie.value);

  if (!Number.isInteger(userId)) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalMessages = await prisma.contactMessage.count();

  const unreadMessages = await prisma.contactMessage.count({
    where: {
      read: false,
    },
  });

  return (
    <ArticlesClient
      articles={articles}
      totalMessages={totalMessages}
      unreadMessages={unreadMessages}
    />
  );
}