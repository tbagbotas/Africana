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
               className="object-contain object-center"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

              {/* Adjusted Mobile Padding for Badges */}
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 sm:left-6 sm:top-6 sm:gap-2">
                {featuredArticle.breaking && (
                  <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg sm:px-3 sm:py-1.5 sm:text-xs">
                    BREAKING
                  </span>
                )}
                {featuredArticle.featured && (
                  <span className="rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-black shadow-lg sm:px-3 sm:py-1.5 sm:text-xs">
                    FEATURED
                  </span>
                )}
                {featuredArticle.trending && (
                  <span className="rounded-full bg-orange-500 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg sm:px-3 sm:py-1.5 sm:text-xs">
                    TRENDING
                  </span>
                )}
              </div>

              {/* Adjusted Mobile Padding and Text Sizes */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white sm:p-7 lg:p-8">
                <span className="inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:px-3 sm:py-1 sm:text-xs">
                  {featuredArticle.category || "Africa"}
                </span>

                <h1 className="mt-2 max-w-4xl text-xl font-extrabold leading-tight tracking-tight sm:mt-3 sm:text-4xl lg:text-5xl">
                  {featuredArticle.title}
                </h1>

                {featuredArticle.subtitle && (
                  <p className="mt-1.5 max-w-3xl line-clamp-2 text-xs font-medium leading-5 text-gray-200 sm:mt-3 sm:text-base sm:leading-6 lg:text-lg">
                    {featuredArticle.subtitle}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-200 sm:mt-4 sm:gap-x-4 sm:gap-y-2 sm:text-sm">
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

          <div className="p-4 sm:p-7">
            {heroExcerpt && (
              <p className="text-sm leading-6 text-gray-600 sm:text-lg sm:leading-7">
                {heroExcerpt}
              </p>
            )}

            <Link
              href={`/article/${featuredArticle.slug}`}
              className="mt-4 inline-flex items-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 sm:mt-6 sm:px-6 sm:py-3 sm:text-base"
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
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
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
                className="group flex gap-4 rounded-xl px-1 py-4 transition hover:bg-gray-50 first:pt-0 last:pb-0 sm:gap-5 sm:px-2 sm:py-5"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-28">
                  <Image
                    src={article.image || "/images/africa1.jpg"}
                    alt={article.title}
                    fill
                    sizes="112px"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/85 text-xs font-black text-white shadow-lg ring-2 ring-white/70 sm:left-2 sm:top-2 sm:h-8 sm:w-8 sm:text-sm">
                    {index + 1}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 sm:px-2.5 sm:py-1 sm:text-[11px]">
                      {article.category || "Africa"}
                    </span>
                    {article.breaking && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-red-700 sm:px-2.5 sm:py-1 sm:text-[11px]">
                        BREAKING
                      </span>
                    )}
                    {article.trending && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-orange-700 sm:px-2.5 sm:py-1 sm:text-[11px]">
                        TRENDING
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 line-clamp-3 text-base font-bold leading-6 text-gray-900 transition group-hover:text-emerald-700 sm:mt-3 sm:text-xl">
                    {article.title}
                  </h3>

                  <p className="mt-1 text-[10px] font-medium text-gray-500 sm:mt-2 sm:text-xs">
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