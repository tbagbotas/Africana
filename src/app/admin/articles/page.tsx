export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";
import LogoutButton from "./LogoutButton";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      publishedAt: "desc",
    },
  });

  const totalArticles = articles.length;

  const publishedArticles = articles.filter(
    (article) => article.published
  ).length;

  const breakingArticles = articles.filter(
    (article) => article.breaking
  ).length;

  const featuredArticles = articles.filter(
    (article) => article.featured
  ).length;

  const trendingArticles = articles.filter(
    (article) => article.trending
  ).length;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Africana CMS
            </h1>

            <p className="mt-2 text-gray-600">
              Professional News Management Dashboard
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              + New Article
            </Link>

            <LogoutButton />
          </div>

        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Total Articles
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {totalArticles}
            </h2>
          </div>

          <div className="rounded-xl bg-green-50 p-6 shadow">
            <p className="text-green-700">
              Published
            </p>

            <h2 className="mt-2 text-4xl font-bold text-green-700">
              {publishedArticles}
            </h2>
          </div>

          <div className="rounded-xl bg-red-50 p-6 shadow">
            <p className="text-red-700">
              Breaking
            </p>

            <h2 className="mt-2 text-4xl font-bold text-red-700">
              {breakingArticles}
            </h2>
          </div>

          <div className="rounded-xl bg-yellow-50 p-6 shadow">
            <p className="text-yellow-700">
              Featured
            </p>

            <h2 className="mt-2 text-4xl font-bold text-yellow-700">
              {featuredArticles}
            </h2>
          </div>

          <div className="rounded-xl bg-blue-50 p-6 shadow">
            <p className="text-blue-700">
              Trending
            </p>

            <h2 className="mt-2 text-4xl font-bold text-blue-700">
              {trendingArticles}
            </h2>
          </div>

        </div>

        {/* Articles Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Image
                </th>

                <th className="p-4 text-left">
                  Title
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Published
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {articles.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500"
                  >
                    No articles found.
                  </td>

                </tr>

              ) : (

                articles.map((article) => (

                  <tr
                    key={article.id}
                    className="border-t transition hover:bg-slate-50"
                  >

                    {/* Image */}
                    <td className="p-4">

                      <div className="relative h-20 w-28 overflow-hidden rounded-lg">

                        <Image
                          src={article.image || "/placeholder.jpg"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />

                      </div>

                    </td>

                    {/* Title */}
                    <td className="p-4">

                      <h3 className="font-bold">
                        {article.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {article.author || "Africana News"}
                      </p>

                    </td>

                    {/* Category */}
                    <td className="p-4">
                      {article.category || "-"}
                    </td>

                    {/* Status */}
                    <td className="p-4">

                      <div className="flex flex-wrap gap-2">

                        {article.status === "scheduled" ? (

                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Scheduled
                          </span>

                        ) : article.published ? (

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Published
                          </span>

                        ) : (

                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold">
                            Draft
                          </span>

                        )}

                        {article.breaking && (

                          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                            BREAKING
                          </span>

                        )}

                        {article.featured && (

                          <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold">
                            FEATURED
                          </span>

                        )}

                        {article.trending && (

                          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                            TRENDING
                          </span>

                        )}

                      </div>

                    </td>

                    {/* Published Date */}
                    <td className="p-4">

                      {new Date(
                        article.publishedAt
                      ).toLocaleDateString()}

                    </td>

                    {/* Actions */}
                    <td className="p-4">

                      <div className="flex flex-wrap gap-2">

                        <Link
                          href={`/article/${article.slug}`}
                          className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/articles/edit/${article.id}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <DeleteButton
                          id={article.id}
                        />

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}
