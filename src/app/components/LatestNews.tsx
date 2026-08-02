import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LatestNews() {
  const latestArticles = await prisma.article.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
  });

  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-extrabold">
          📰 Latest News
        </h2>

        <Link
          href="/category/world"
          className="text-emerald-700 font-semibold hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {latestArticles.map((article) => {
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
              <div className="md:flex">
                <div className="relative md:w-72 h-64 md:h-auto flex-shrink-0">
                  <Image
                    src={article.image || "/placeholder.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <span className="inline-block bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>

                    <h3 className="text-2xl font-bold mt-4 leading-tight">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 mt-4 line-clamp-3">
                      {excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-6">
                      <span>✍️ {article.author}</span>

                      <span>
                        📍 {article.location || "Unknown"}
                      </span>

                      <span>
                        🕒{" "}
                        {new Date(
                          article.publishedAt
                        ).toLocaleDateString()}
                      </span>

                      <span>⏱ {article.readTime}</span>
                    </div>

                    <Link
                      href={`/article/${article.slug}`}
                      className="inline-block mt-6 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Read Full Story →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}