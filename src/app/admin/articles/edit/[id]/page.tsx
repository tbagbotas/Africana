export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";

import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

import AdminNav from "../../../components/AdminNav";
import EditArticleForm from "./EditArticleForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isInteger(articleId)) {
    notFound();
  }

  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });

  if (!article) {
    notFound();
  }

  const unreadMessages = await prisma.contactMessage.count({
    where: {
      read: false,
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 lg:flex">
      <AdminNav unreadMessages={unreadMessages} />

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h1 className="mb-8 text-3xl font-bold">
              Edit Article
            </h1>

            <EditArticleForm
              article={{
                id: article.id,
                title: article.title,
                subtitle: article.subtitle,
                category: article.category || "Africa",
                author: article.author,
                content: article.content,
                image: article.image,
                location: article.location,
                readTime: article.readTime,
                seoTitle: article.seoTitle,
                metaDescription: article.metaDescription,
                keywords: article.keywords,
                status: article.status,
                publishedAt: article.publishedAt,
                featured: article.featured,
                trending: article.trending,
                breaking: article.breaking,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}