import CategoryPage from "../components/CategoryPage";
import { prisma } from "@/lib/prisma";

export default async function AfricaPage() {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      category: "Africa",
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
const formattedArticles = articles.map((article) => ({
  ...article,
  tags: article.tags
    ? article.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [],
  publishedAt: article.publishedAt
    ? article.publishedAt.toISOString()
    : "",
  updatedAt: article.updatedAt
    ? article.updatedAt.toISOString()
    : "",
}));
  return (
    <CategoryPage
      title="Africa News"
      description="Stay informed with the latest news, politics, business, technology, sports, culture, and human-interest stories from across Africa."
      articles={formattedArticles}
    />
  );
}