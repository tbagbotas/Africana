import Image from "next/image";
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
      published: true,
      NOT: {
        slug: article.slug,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {/* Category */}
        <span className="inline-block rounded-full bg-emerald-700 px-3 py-1 text-sm font-semibold text-white">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="mt-4 text-xl leading-relaxed text-gray-600 md:text-2xl">
            {article.subtitle}
          </p>
        )}

        {/* Article information */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
          {article.author && (
            <span>✍️ {article.author}</span>
          )}

          {article.location && (
            <span>📍 {article.location}</span>
          )}

          {article.publishedAt && (
            <span>
              📅{" "}
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          )}

          {article.readTime && (
            <span>⏱ {article.readTime}</span>
          )}
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="relative mt-8 w-full overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt={article.title}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article
          className="prose prose-lg mt-10 max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              article.content ||
              "<p>No article content available.</p>",
          }}
        />

        {/* Tags */}
        {article.tags && (
          <div className="mt-10">
            <h3 className="mb-4 text-xl font-bold">
              Tags
            </h3>

            <div className="flex flex-wrap gap-3">
              {article.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-200 px-4 py-2 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        <section className="mt-16">
          <h2 className="mb-6 text-3xl font-bold">
            Related Articles
          </h2>

          {relatedArticles.length === 0 ? (
            <p className="text-gray-500">
              No related articles available.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.slug}`}
                  className="group overflow-hidden rounded-lg border bg-white shadow transition hover:shadow-lg"
                >
                  {/* Related Image */}
                  {item.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Related Article Text */}
                  <div className="p-4">
                    <span className="text-xs font-semibold uppercase text-emerald-700">
                      {item.category}
                    </span>

                    <h3 className="mt-2 text-xl font-bold">
                      {item.title}
                    </h3>

                    {item.subtitle && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {item.subtitle}
                      </p>
                    )}

                    <span className="mt-4 inline-block font-semibold text-emerald-700">
                      Read Article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}