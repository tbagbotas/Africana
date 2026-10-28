import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LatestNews() {
  const now = new Date();

  const latestArticles = await prisma.article.findMany({
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

  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-6">
      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          📰 Latest News
        </h2>

        <Link
          href="/latest"
          className="whitespace-nowrap font-semibold text-emerald-700 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Latest Articles */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {latestArticles.map((article) => {
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
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="sm:flex">
                {/* Article Image */}
                <div className="relative h-56 w-full shrink-0 sm:h-auto sm:w-56 lg:w-64">
                  <Image
                    src={article.image || "/images/africa.jpg"}
                    alt={article.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 224px, 256px"
                    className="object-cover"
                  />

                  {/* Breaking Badge */}
                  {article.breaking && (
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        BREAKING
                      </span>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {article.featured && (
                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black shadow-lg">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    {/* Category */}
                    <span className="inline-block rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                      {article.category}
                    </span>

                    {/* Title */}
                    <h3 className="mt-3 text-xl font-bold leading-tight sm:text-2xl">
                      {article.title}
                    </h3>

                    {/* Subtitle */}
                    {article.subtitle && (
                      <p className="mt-2 font-medium text-gray-700">
                        {article.subtitle}
                      </p>
                    )}

                    {/* Excerpt */}
                    {excerpt && (
                      <p className="mt-3 line-clamp-3 text-gray-600">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Article Information */}
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span>
                        ✍️ {article.author || "Africana News"}
                      </span>

                      {article.location && (
                        <span>
                          📍 {article.location}
                        </span>
                      )}

                      <span>
                        📅{" "}
                        {new Date(
                          article.publishedAt
                        ).toLocaleDateString()}
                      </span>

                      <span>
                        ⏱ {article.readTime || "5 min"}
                      </span>
                    </div>

                    {/* Read Story Button */}
                    <Link
                      href={`/article/${article.slug}`}
                      className="mt-5 inline-block rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
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