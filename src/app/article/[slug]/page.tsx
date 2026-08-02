import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
  });

  if (!article) {
    notFound();
  }

  const relatedArticles = await prisma.article.findMany({
    where: {
      category: article.category,
      NOT: {
        slug: article.slug,
      },
      published: true,
    },
    take: 3,
  });

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">

        <span className="inline-block bg-emerald-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {article.category}
        </span>

        <h1 className="text-5xl font-bold mt-4">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-2xl text-gray-600 mt-4">
            {article.subtitle}
          </p>
        )}

        <div className="mt-6 text-gray-500 text-sm flex flex-wrap gap-4">
          <span>✍️ {article.author}</span>
          <span>📍 {article.location}</span>
          <span>
            📅 {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <span>⏱ {article.readTime}</span>
        </div>

        {article.image && (
          <div className="mt-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full rounded-xl object-cover max-h-[550px]"
            />
          </div>
        )}

        <article
          className="mt-10 prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: article.content,
          }}
        />

        {article.tags && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">
              Tags
            </h3>

            <div className="flex flex-wrap gap-3">
              {article.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 px-4 py-2 rounded-full text-sm"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">
            Related Articles
          </h2>

          {relatedArticles.length === 0 ? (
            <p className="text-gray-500">
              No related articles available.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-4">
                    <span className="text-sm text-emerald-700 font-semibold">
                      {item.category}
                    </span>

                    <h3 className="text-xl font-bold mt-2 mb-3">
                      {item.title}
                    </h3>

                    <Link
                      href={`/article/${item.slug}`}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </>
  );
}