import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TrendingNews() {
  const now = new Date();

  let trendingArticles = await prisma.article.findMany({
    where: {
      published: true,
      trending: true,
      OR: [
        {
          status: "published",
        },
        {
          status: "scheduled",
          publishedAt: {
            lte: now,
          },
        },
      ],
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
        OR: [
          {
            status: "published",
          },
          {
            status: "scheduled",
            publishedAt: {
              lte: now,
            },
          },
        ],
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
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-700">
            What&apos;s getting attention
          </span>

          <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">
            🔥 Trending Today
          </h2>
        </div>

        <Link
          href="/trending"
          className="whitespace-nowrap font-semibold text-emerald-700 transition hover:text-emerald-900 hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {trendingArticles.map((article, index) => {
          const rawText = article.excerpt || article.content || "";

          const cleanExcerpt = rawText
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

          const excerpt =
            cleanExcerpt.length > 140
              ? `${cleanExcerpt.substring(0, 140)}...`
              : cleanExcerpt;

          return (
            <article
              key={article.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <Link
                href={`/article/${article.slug}`}
                className="block"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={article.image || "/images/africa.jpg"}
                    alt={article.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white shadow-lg">
                      #{index + 1} TRENDING
                    </span>
                  </div>

                  {article.breaking && (
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        BREAKING
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <span className="inline-block rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                  {article.category}
                </span>

                <h3 className="mt-4 text-2xl font-bold leading-tight transition group-hover:text-emerald-700">
                  <Link href={`/article/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                {excerpt && (
                  <p className="mt-4 line-clamp-3 text-gray-600">
                    {excerpt}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    ✍️ {article.author || "Africana News"}
                  </span>

                  <span>
                    ⏱ {article.readTime || "5 min"}
                  </span>
                </div>

                <Link
                  href={`/article/${article.slug}`}
                  className="mt-6 inline-block rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
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