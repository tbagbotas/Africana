import { notFound } from "next/navigation";
import CategoryPage from "@/app/components/CategoryPage";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Category({ params }: PageProps) {
  const { slug } = await params;

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      category: categoryName,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  if (!articles) {
    notFound();
  }

  const formattedArticles = articles.map((article) => ({
    ...article,
    tags: article.tags
      ? article.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    publishedAt: article.publishedAt
      ? article.publishedAt.toISOString()
      : "",
    updatedAt: article.updatedAt
      ? article.updatedAt.toISOString()
      : "",
    author: article.author ?? undefined,
    category: article.category ?? undefined,
    location: article.location ?? undefined,
    image: article.image ?? undefined,
    subtitle: article.subtitle ?? undefined,
    readTime: article.readTime ?? undefined,
  }));

  return (
    <CategoryPage
      title={`${categoryName} News`}
      description={`Latest ${categoryName.toLowerCase()} news and stories.`}
      articles={formattedArticles}
    />
  );
}