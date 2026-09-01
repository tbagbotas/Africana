import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getFallbackImage(category: string | null) {
  const value = (category || "").toLowerCase();

  if (value.includes("sport")) {
    return "/images/sports.jpg";
  }

  if (value.includes("technology") || value.includes("tech")) {
    return "/images/technology.jpg";
  }

  if (value.includes("business") || value.includes("econom")) {
    return "/images/business.jpg";
  }

  if (value.includes("politic")) {
    return "/images/politics.jpg";
  }

  if (value.includes("entertain")) {
    return "/images/entertainment.jpg";
  }

  if (value.includes("world")) {
    return "/images/world.jpg";
  }

  return "/images/africa.jpg";
}

export default async function LatestPage() {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <span className="inline-block bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-bold">
            📰 LATEST
          </span>

          <h1 className="text-5xl font-extrabold mt-5">
            Latest News
          </h1>

          <p className="text-gray-600 text-lg mt-3">
            The latest stories and developments from Africa and around the world.
          </p>
        </div>

        {/* No Articles */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold">
              No published articles yet
            </h2>

            <p className="text-gray-600 mt-3">
              Publish an article from the Admin panel to see it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => {
              const excerpt = (
                article.excerpt || article.content
              )
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .substring(0, 160);

              const imageSrc =
                article.image || getFallbackImage(article.category);

              return (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                >
                  {/* Image */}
                  <Link href={`/article/${article.slug}`}>
                    <div className="relative h-56">
                      <Image
                        src={imageSrc}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <span className="inline-block bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>

                    <h2 className="text-2xl font-bold mt-4 leading-tight">
                      <Link href={`/article/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 mt-4 line-clamp-3">
                      {excerpt}
                      {excerpt.length >= 160 ? "..." : ""}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-5">
                      <span>✍️ {article.author}</span>

                      <span>
                        📅{" "}
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
                      Read Story →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}