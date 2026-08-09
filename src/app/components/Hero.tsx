import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Hero() {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 5,
  });

  if (articles.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="bg-white rounded-xl p-10 text-center shadow">
          <h2 className="text-2xl font-bold">
            No published articles yet
          </h2>

          <p className="text-gray-600 mt-2">
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

  const heroExcerpt = (
    featuredArticle.excerpt || featuredArticle.content
  )
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 220) + "...";

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Hero */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-xl">

          <div className="relative h-[320px] md:h-[450px] lg:h-[520px]">
            <Image
              src={featuredArticle.image || "/placeholder.jpg"}
              alt={featuredArticle.title}
              fill
              priority
              unoptimized
              className="object-cover"
            />

            {featuredArticle.breaking && (
              <div className="absolute top-5 left-5 z-10">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                  BREAKING
                </span>
              </div>
            )}
          </div>

          <div className="p-8">
            <span className="inline-block bg-emerald-700 text-white px-3 py-1 rounded-full text-sm">
              {featuredArticle.category}
            </span>

            <h1 className="text-5xl font-extrabold mt-5 leading-tight">
              {featuredArticle.title}
            </h1>

            <p className="text-lg text-gray-600 mt-6 leading-8">
              {heroExcerpt}
            </p>

            <div className="flex flex-wrap gap-5 mt-6 text-gray-500 text-sm">
              <span>✍️ {featuredArticle.author}</span>
              <span>📍 {featuredArticle.location || "Unknown"}</span>
              <span>
                🕒 {new Date(featuredArticle.publishedAt).toLocaleDateString()}
              </span>
              <span>⏱ {featuredArticle.readTime}</span>
            </div>

            <Link
              href={`/article/${featuredArticle.slug}`}
              className="inline-block mt-8 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold transition"
            >
              Read Full Story →
            </Link>
          </div>
        </div>

        {/* Top Stories */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 border-b pb-3">
              Top Stories
            </h2>            {topStories.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="flex gap-4 mb-6 last:mb-0 group"
              >
                <div className="relative w-28 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={article.image || "/placeholder.jpg"}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-red-600">
                    {article.category}
                  </span>

                  <h3 className="font-bold mt-1 group-hover:text-emerald-700 transition">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {article.readTime}
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