import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: {
      slug,
      ...publishedFilter,
    },
    select: {
      title: true,
      subtitle: true,
      image: true,
      seoTitle: true,
      metaDescription: true,
      keywords: true,
      author: true,
    },
  });

  if (!article) {
    return {
      title: "Article Not Found | Africana",
      description:
        "The requested Africana article could not be found.",
    };
  }

  const title = article.seoTitle?.trim() || article.title;

  const description =
    article.metaDescription?.trim() ||
    article.subtitle?.trim() ||
    "Read the latest African news and stories on Africana.";

  const keywords =
    article.keywords
      ?.split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean) || [];

  return {
    title,
    description,
    keywords,
    authors: [
      {
        name: article.author || "Africana News",
      },
    ],

    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Africana",
      images: article.image
        ? [
            {
              url: article.image,
              width: 1200,
              height: 675,
              alt: article.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: article.image
        ? "summary_large_image"
        : "summary",
      title,
      description,
      images: article.image
        ? [article.image]
        : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: {
      slug,
      ...publishedFilter,
    },
  });

  if (!article) {
    notFound();
  }

  const relatedArticles = await prisma.article.findMany({
    where: {
      category: article.category,
      ...publishedFilter,
      NOT: {
        slug: article.slug,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  /*
   * Clean tags before displaying them.
   * This prevents accidental SEO text from
   * appearing inside the visible Tags section.
   */
  const cleanTags =
    article.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .filter(
        (tag) =>
          !tag.toLowerCase().includes("seo title:")
      )
      .map((tag) =>
        tag.replace(/seo title:.*/i, "").trim()
      )
      .filter(Boolean) || [];

  return (
    <>
      <Header />

      <main className="bg-gray-100">

        {/* ARTICLE HEADER */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-6">
          <div className="mx-auto max-w-5xl">

            <Link
              href={`/category/${(article.category ?? "africa")
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="inline-block rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-emerald-800"
            >
              {article.category ?? "Africa"}
            </Link>

            <div className="mt-4 flex flex-wrap gap-2">

              {article.breaking && (
                <span className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                  BREAKING
                </span>
              )}

              {article.featured && (
                <span className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black">
                  FEATURED
                </span>
              )}

              {article.trending && (
                <span className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                  TRENDING
                </span>
              )}

            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="mt-5 max-w-4xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
                {article.subtitle}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-b border-gray-200 pb-7 text-sm text-gray-500">

              <span>
                ✍️{" "}
                <strong className="text-gray-700">
                  {article.author || "Africana News"}
                </strong>
              </span>

              {article.location && (
                <span>
                  📍 {article.location}
                </span>
              )}

              {article.publishedAt && (
                <span>
                  📅{" "}
                  {new Date(
                    article.publishedAt
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}

              <span>
                ⏱ {article.readTime || "5 min"}
              </span>

            </div>
          </div>
        </section>

        {/* FEATURED IMAGE */}
        {article.image && (
          <section className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="relative aspect-video w-full">

                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
                  className="object-cover"
                />

              </div>
            </div>
          </section>
        )}

        {/* ARTICLE BODY */}
        <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-5 shadow-lg sm:p-8 lg:p-10">

            <article
              className="
                prose prose-lg max-w-none
                prose-headings:font-extrabold
                prose-headings:text-gray-950
                prose-p:leading-8
                prose-p:text-gray-700
                prose-a:text-emerald-700
                prose-a:font-semibold
                prose-strong:text-gray-950
                prose-img:rounded-xl
              "
              dangerouslySetInnerHTML={{
                __html:
                  article.content ||
                  "<p>No article content available.</p>",
              }}
            />

            {/* TAGS */}
            {cleanTags.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-8">

                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Tags
                </h3>

                <div className="flex flex-wrap gap-2">

                  {cleanTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}

                </div>
              </div>
            )}

          </div>
        </section>

        {/* MORE STORIES */}
        <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-6">
          <div className="mx-auto max-w-6xl">

            <div className="mb-8">

              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold uppercase tracking-wide text-emerald-700">
                MORE STORIES
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-950 sm:text-4xl">
                Related Articles
              </h2>

              <p className="mt-2 text-gray-600">
                More stories you may be interested in.
              </p>

            </div>

            {relatedArticles.length === 0 ? (

              <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
                <p className="text-gray-500">
                  No related articles available yet.
                </p>
              </div>

            ) : (

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {relatedArticles.map((item) => {

                  const relatedExcerpt = (
                    item.excerpt ||
                    item.content ||
                    ""
                  )
                    .replace(/<[^>]*>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();

                  const shortExcerpt =
                    relatedExcerpt.length > 120
                      ? `${relatedExcerpt.substring(
                          0,
                          120
                        )}...`
                      : relatedExcerpt;

                  return (
                    <Link
                      key={item.id}
                      href={`/article/${item.slug}`}
                      className="group overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >

                      <div className="relative aspect-video overflow-hidden bg-gray-100">

                        <Image
                          src={
                            item.image ||
                            "/placeholder.jpg"
                          }
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 384px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold uppercase text-white">
                            {item.category}
                          </span>
                        </div>

                      </div>

                      <div className="p-6">

                        <h3 className="text-xl font-bold leading-tight text-gray-950 transition group-hover:text-emerald-700">
                          {item.title}
                        </h3>

                        {shortExcerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                            {shortExcerpt}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between">

                          <span className="font-semibold text-emerald-700">
                            Read Article →
                          </span>

                          <span className="text-xs text-gray-500">
                            ⏱ {item.readTime || "5 min"}
                          </span>

                        </div>

                      </div>

                    </Link>
                  );
                })}

              </div>
            )}

          </div>
        </section>

        {/* BACK TO LATEST */}
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center lg:px-6">

            <Link
              href="/latest"
              className="inline-block rounded-xl bg-emerald-700 px-7 py-3 font-bold text-white transition hover:bg-emerald-800"
            >
              ← Back to Latest News
            </Link>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}