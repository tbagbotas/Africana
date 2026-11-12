import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import type { Article } from "@/lib/types/article";

interface CategoryPageProps {
  title: string;
  description: string;
  articles: Article[];
}

export default function CategoryPage({
  title,
  description,
  articles,
}: CategoryPageProps) {
  return (
    <>
      <Header />

      <main className="w-full max-w-[1800px] mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>

          <p className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg">
            {description}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No articles have been published in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/article/${article.slug}`}>
                  <div className="relative h-64 w-full overflow-hidden bg-gray-100 sm:h-72">
                    <Image
                      src={article.image || "/placeholder.jpg"}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-6">
                  <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
                    {article.category}
                  </div>

                  <h2 className="mb-3 text-2xl font-bold leading-tight text-gray-900 transition group-hover:text-green-700">
                    <Link href={`/article/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <div
                    className="mb-5 line-clamp-3 text-base leading-7 text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: article.excerpt,
                    }}
                  />

                  <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <Link
                    href={`/article/${article.slug}`}
                    className="inline-flex items-center font-semibold text-green-700 transition hover:text-green-900 hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}