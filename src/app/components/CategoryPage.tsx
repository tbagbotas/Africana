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

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>

        <p className="text-gray-600 mb-10">{description}</p>

        {articles.length === 0 ? (
          <p className="text-gray-500">
            No articles have been published in this category yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <span className="text-sm text-green-700 font-semibold">
                    {article.category}
                  </span>

                  <h2 className="text-xl font-bold mt-2 mb-3">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="text-sm text-gray-500 mb-4">
                    {article.author} • {article.publishedAt} • {article.readTime}
                  </div>

                  <Link
                    href={`/article/${article.slug}`}
                    className="text-green-700 font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}