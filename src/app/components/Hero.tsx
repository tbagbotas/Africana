import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Hero() {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      OR: [
        {
          status: "published",
        },
        {
          status: "scheduled",
          publishedAt: {
            lte: new Date(),
          },
        },
      ],
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
  });

  if (articles.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-bold">
            No published articles yet
          </h2>

          <p className="mt-2 text-gray-600">
            Publish your first article from the Admin panel.
          </p>
        </div>
      </section>
    );
  }

  const featuredArticle =
    articles.find((article) => article.featured) ?? articles[0];

  const topStories = articles.filter(
    (article) => article.id !== featuredArticle.id
  );

  const rawExcerpt =
    featuredArticle.excerpt || featuredArticle.content || "";

  const cleanExcerpt = rawExcerpt
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const heroExcerpt =
    cleanExcerpt.length > 220
      ? `${cleanExcerpt.substring(0, 220)}...`
      : cleanExcerpt;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
        <article className="overflow-hidden rounded-2xl bg-white shadow-xl lg:col-span-2">
          <div className="relative h-64 sm:h-80 md:h-112.5 lg:h-130">
            <Image
              src={featuredArticle.image || "/images/africa.jpg"}
              alt={featuredArticle.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />

            {featuredArticle.breaking && (
              <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
                <span className="rounded-full bg-red-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg sm:px-4 sm:py-2 sm:text-base">
                  BREAKING
                </span>
              </div>
            )}

            {featuredArticle.featured && (
              <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
                <span className="rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black shadow-lg sm:px-4 sm:py-2 sm:text-sm">
                  FEATURED
                </span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            <span className="inline-block rounded-full bg-emerald-700 px-3 py-1 text-sm font-semibold text-white">
              {featuredArticle.category}
            </span>

            <h1 className="mt-4 wrap-break-word text-3xl font-extrabold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              {featuredArticle.title}
            </h1>

            {featuredArticle.subtitle && (
              <p className="mt-4 text-lg font-semibold leading-7 text-gray-700">
                {featuredArticle.subtitle}
              </p>
            )}

            {heroExcerpt && (
              <p className="mt-5 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
                {heroExcerpt}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500 sm:gap-5">
              <span>
                ✍️ {featuredArticle.author || "Africana News"}
              </span>

              {featuredArticle.location && (
                <span>
                  📍 {featuredArticle.location}
                </span>
              )}

              <span>
                📅{" "}
                {new Date(
                  featuredArticle.publishedAt
                ).toLocaleDateString()}
              </span>

              <span>
                ⏱ {featuredArticle.readTime || "5 min"}
              </span>
            </div>

            <Link
              href={`/article/${featuredArticle.slug}`}
              className="mt-7 inline-block rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 sm:mt-8 sm:px-8 sm:py-4"
            >
              Read Full Story →
            </Link>
          </div>
        </article>

        <aside>
          <div className="rounded-2xl bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-6 flex items-center justify-between border-b pb-3">
              <h2 className="text-2xl font-bold">
                Top Stories
              </h2>

              <Link
                href="/latest"
                className="text-sm font-semibold text-emerald-700 hover:underline"
              >
                Latest →
              </Link>
            </div>

            <div className="space-y-6">
              {topStories.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group flex gap-4"
                >
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={article.image || "/images/africa.jpg"}
                      alt={article.title}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      {article.category}
                    </span>

                    <h3 className="mt-1 line-clamp-3 font-bold leading-5 transition group-hover:text-emerald-700">
                      {article.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      ⏱ {article.readTime || "5 min"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}