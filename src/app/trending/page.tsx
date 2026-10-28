import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      trending: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="mb-10">
          <span className="inline-block rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
            🔥 TRENDING
          </span>

          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
            Trending News
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            The stories readers are following right now.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-bold">
              No trending articles yet
            </h2>

            <p className="mt-3 text-gray-600">
              Mark published articles as Trending from the Admin panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-56">
                  <Image
                    src={article.image || "/placeholder.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      #{index + 1} TRENDING
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs font-bold uppercase text-emerald-700">
                    {article.category}
                  </span>

                  <h2 className="mt-2 text-2xl font-bold leading-tight group-hover:text-emerald-700">
                    {article.title}
                  </h2>

                  {article.subtitle && (
                    <p className="mt-3 line-clamp-2 text-gray-600">
                      {article.subtitle}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
                    {article.author && (
                      <span>✍️ {article.author}</span>
                    )}

                    {article.readTime && (
                      <span>⏱ {article.readTime}</span>
                    )}
                  </div>

                  <div className="mt-5 font-semibold text-emerald-700">
                    Read Story →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}