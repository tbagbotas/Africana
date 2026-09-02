import { redirect } from "next/navigation";

import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

import AdminNav from "../../components/AdminNav";
import NewArticleClient from "./NewArticleClient";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const unreadMessages = await prisma.contactMessage.count({
    where: {
      read: false,
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 lg:flex">
      {/* Admin Navigation */}
      <AdminNav unreadMessages={unreadMessages} />

      {/* New Article Content */}
      <div className="min-w-0 flex-1">
        <NewArticleClient />
      </div>
    </main>
  );
}