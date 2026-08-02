import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TrendingNews() {
  let trendingArticles = await prisma.article.findMany({
    where: {
      published: true,
      trending: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
  });

  if (trendingArticles.length === 0) {
    trendingArticles = await prisma.article.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 6,
    });
  }

  if (trendingArticles.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-extrabold">
          🔥 Trending Today
        </h2>

        <Link
          href="/category/world"
          className="text-emerald-700 font-semibold hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {trendingArticles.map((article, index) => {
          const excerpt = (article.excerpt || article.content)
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 140) + "...";

          return (
            <article
              key={article.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <div className="relative h-56">
                <Image
                  src={article.image || "/placeholder.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    #{index + 1} TRENDING
                  </span>
                </div>
              </div>

              <div className="p-6">
                <span className="inline-block bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {article.category}
                </span>

                <h3 className="text-2xl font-bold mt-4 leading-tight">
                  {article.title}
                </h3>

                <p className="text-gray-600 mt-4 line-clamp-3">
                  {excerpt}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-5">
                  <span>✍️ {article.author}</span>
                  <span>⏱ {article.readTime}</span>
                </div>

                <Link
                  href={`/article/${article.slug}`}
                  className="inline-block mt-6 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Read More →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}