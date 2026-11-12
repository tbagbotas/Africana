import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const publishedFilter = {
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
};

function cleanText(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function Hero() {
  const articles = await prisma.article.findMany({
    where: publishedFilter,
    orderBy: [
      {
        featured: "desc",
      },
      {
        publishedAt: "desc",
      },
    ],
    take: 12,
  });

  if (articles.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1800px] px-4 py-8 lg:px-6">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900">
            No published articles yet
          </h2>
          <p className="mt-2 text-gray-600">
            Publish your first article from the Admin panel.
          </p>
        </div>
      </section>
    );
  }

  const featuredArticle = articles.find((article) => article.featured) ?? articles[0];

  const topStories = articles
    .filter((article) => article.id !== featuredArticle.id)
    .sort((a, b) => {
      const score = (article: typeof a) =>
        (article.breaking ? 3 : 0) +
        (article.trending ? 2 : 0) +
        (article.featured ? 1 : 0);

      return score(b) - score(a);
    })
    .slice(0, 5);

  const rawExcerpt = featuredArticle.excerpt || featuredArticle.content || "";
  const cleanExcerpt = cleanText(rawExcerpt);
  const heroExcerpt =
    cleanExcerpt.length > 240
      ? `${cleanExcerpt.substring(0, 240)}...`
      : cleanExcerpt;

  return (
    <section className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:py-10 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Featured Story */}
        <article className="group overflow-hidden rounded-2xl bg-white shadow-xl lg:col-span-2">
          <Link href={`/article/${featuredArticle.slug}`} className="block">
            <div className="relative aspect-16/10 w-full overflow-hidden sm:aspect-video">
              <Image
                src={featuredArticle.image || "/images/africa1.jpg"}
                alt={featuredArticle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                {featuredArticle.breaking && (
                  <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg">
                    BREAKING
                  </span>
                )}
                {featuredArticle.featured && (
                  <span className="rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-black shadow-lg">
                    FEATURED
                  </span>
                )}
                {featuredArticle.trending && (
                  <span className="rounded-full bg-orange-500 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg">
                    TRENDING
                  </span>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7 lg:p-8">
                <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  {featuredArticle.category || "Africa"}
                </span>

                <h1 className="mt-3 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {featuredArticle.title}
                </h1>

                {featuredArticle.subtitle && (
                  <p className="mt-3 max-w-3xl line-clamp-2 text-sm font-medium leading-6 text-gray-200 sm:text-base lg:text-lg">
                    {featuredArticle.subtitle}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-200 sm:text-sm">
                  <span>By {featuredArticle.author || "Africana News"}</span>
                  {featuredArticle.location && (
                    <span>Location: {featuredArticle.location}</span>
                  )}
                  <span>
                    Published{" "}
                    {new Date(featuredArticle.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>{featuredArticle.readTime || "5 min"}</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="p-5 sm:p-7">
            {heroExcerpt && (
              <p className="text-base leading-7 text-gray-600 sm:text-lg">
                {heroExcerpt}
              </p>
            )}

            <Link
              href={`/article/${featuredArticle.slug}`}
              className="mt-6 inline-flex items-center rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
            >
              Read Full Story
              <span className="ml-2 transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </article>

        {/* Top Stories */}
        <aside className="rounded-2xl bg-white p-5 shadow-xl sm:p-6">
          <div className="mb-5 flex items-end justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Africana
              </p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Top Stories
              </h2>
            </div>
            <Link
              href="/latest"
              className="mb-1 text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
            >
              Latest →
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {topStories.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group flex gap-5 rounded-xl px-2 py-5 transition hover:bg-gray-50 first:pt-0 last:pb-0"
              >
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={article.image || "/images/africa1.jpg"}
                    alt={article.title}
                    fill
                    sizes="112px"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/85 text-sm font-black text-white shadow-lg ring-2 ring-white/70">
                    {index + 1}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-800">
                      {article.category || "Africa"}
                    </span>
                    {article.breaking && (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-red-700">
                        BREAKING
                      </span>
                    )}
                    {article.trending && (
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-orange-700">
                        TRENDING
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 line-clamp-3 text-lg font-bold leading-6 text-gray-900 transition group-hover:text-emerald-700 sm:text-xl">
                    {article.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium text-gray-500">
                    {article.readTime || "5 min"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}