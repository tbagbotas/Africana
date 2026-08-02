import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { articles } from "../../data/articles";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams;

  const query = normalize(q);

  const results = articles.filter((article) => {
    const searchableText = normalize(
      [
        article.title,
        article.subtitle,
        article.category,
        article.author,
        article.location,
        article.excerpt,
        article.content,
        article.tags.join(" "),
      ].join(" ")
    );

    return searchableText.includes(query);
  });

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">
          Search Results
        </h1>

        <p className="text-gray-600 mb-8">
          Showing results for: <strong>{q || "All Articles"}</strong>
        </p>

        {results.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">
              No articles found
            </h2>

            <p className="text-gray-600">
              Try searching by:
            </p>

            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Africa</li>
              <li>Technology</li>
              <li>Business</li>
              <li>Politics</li>
              <li>Innovation</li>
              <li>Economy</li>
              <li>Africana News</li>
            </ul>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((article) => (
              <div
                key={article.id}
                className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <span className="text-emerald-700 font-semibold">
                    {article.category}
                  </span>

                  <h2 className="text-2xl font-bold mt-2">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 mt-3">
                    {article.excerpt}
                  </p>

                  <div className="text-sm text-gray-500 mt-4">
                    {article.author} • {article.location}
                  </div>

                  <Link
                    href={`/article/${article.slug}`}
                    className="inline-block mt-5 text-emerald-700 font-semibold hover:underline"
                  >
                    Read Article →
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