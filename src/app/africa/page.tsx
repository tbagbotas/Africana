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

  return (
    <CategoryPage
      title="Africa News"
      description="Stay informed with the latest news, politics, business, technology, sports, culture, and human-interest stories from across Africa."
      articles={articles}
    />
  );
}