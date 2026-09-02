import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { prisma } from "@/lib/prisma";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

function cleanText(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams;

  const query = q.trim();

  const results = query
    ? await prisma.article.findMany({
        where: {
          published: true,
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              subtitle: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              author: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              location: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              excerpt: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              tags: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 30,
      })
    : await prisma.article.findMany({
        where: {
          published: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 30,
      });

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Search Header */}
        <div className="mb-10">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            SEARCH
          </span>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            Search Africana
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            {query
              ? `Showing results for "${query}"`
              : "Browse the latest published stories from Africana."}
          </p>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="rounded-2xl border bg-yellow-50 p-8">
            <h2 className="text-2xl font-bold">
              No articles found
            </h2>

            <p className="mt-3 text-gray-600">
              Try searching for a different topic, category, location,
              author, or keyword.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {[
                "Africa",
                "Technology",
                "Business",
                "Politics",
                "Sports",
                "Innovation",
                "Economy",
              ].map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-700 hover:text-white"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-500">
              {results.length}{" "}
              {results.length === 1 ? "article" : "articles"} found
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((article) => {
                const excerpt = cleanText(
                  article.excerpt || article.content || ""
                );

                return (
                  <article
                    key={article.id}
                    className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <Link
                      href={`/article/${article.slug}`}
                      className="block"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                        <Image
                          src={article.image || "/placeholder.jpg"}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold uppercase text-white">
                            {article.category}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-2xl font-bold leading-tight transition group-hover:text-emerald-700">
                        <Link href={`/article/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {excerpt && (
                        <p className="mt-4 line-clamp-3 text-gray-600">
                          {excerpt}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-500">
                        {article.author && (
                          <span>✍️ {article.author}</span>
                        )}

                        {article.location && (
                          <span>📍 {article.location}</span>
                        )}

                        {article.readTime && (
                          <span>⏱ {article.readTime}</span>
                        )}
                      </div>

                      <Link
                        href={`/article/${article.slug}`}
                        className="mt-6 inline-block font-semibold text-emerald-700 transition hover:text-emerald-900"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}