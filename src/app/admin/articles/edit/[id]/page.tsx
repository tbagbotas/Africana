import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditArticleForm from "./EditArticleForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: PageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-8 text-3xl font-bold">
          Edit Article
        </h1>

        <EditArticleForm
          article={{
            id: article.id,
            title: article.title,
            subtitle: article.subtitle,
            category: article.category,
            author: article.author,
            content: article.content,
            image: article.image,
          }}
        />
      </div>
    </main>
  );
}