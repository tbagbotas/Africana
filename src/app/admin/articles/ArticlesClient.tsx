"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type Article = {
  id: number;
  title: string;
  slug: string;
  author: string | null;
  category: string | null;
  image: string | null;
  status: string;
  published: boolean;
  publishedAt: string | Date;
  featured: boolean;
  trending: boolean;
  breaking: boolean;
};

type Props = {
  articles: Article[];
  totalMessages: number;
  unreadMessages: number;
};

export default function ArticlesClient({
  articles,
  totalMessages,
  unreadMessages,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  async function handleDeleteArticle(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin/articles/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete article.");
      }

      window.location.reload();
    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete article."
      );
    }
  }

  const categories = useMemo(() => {
    const values = articles
      .map((article) => article.category)
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set(values)).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !searchText ||
        article.title.toLowerCase().includes(searchText) ||
        article.slug.toLowerCase().includes(searchText) ||
        (article.author || "").toLowerCase().includes(searchText);

      const matchesCategory =
        category === "all" || article.category === category;

      let matchesStatus = true;

      if (status === "published") {
        matchesStatus = article.published;
      }

      if (status === "draft") {
        matchesStatus = !article.published;
      }

      if (status === "scheduled") {
        matchesStatus = article.status === "scheduled";
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, search, category, status]);

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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Africana CMS
            </h1>

            <p className="mt-2 text-gray-600">
              Professional News Management Dashboard
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            + New Article
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Total Articles
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalArticles}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-5 shadow">
            <p className="text-sm text-green-700">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {publishedArticles}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-5 shadow">
            <p className="text-sm text-red-700">
              Breaking
            </p>

            <p className="mt-2 text-3xl font-bold text-red-700">
              {breakingArticles}
            </p>
          </div>

          <div className="rounded-xl bg-yellow-50 p-5 shadow">
            <p className="text-sm text-yellow-700">
              Featured
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-700">
              {featuredArticles}
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-5 shadow">
            <p className="text-sm text-blue-700">
              Trending
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {trendingArticles}
            </p>
          </div>

          <Link
            href="/admin/messages"
            className="rounded-xl bg-purple-50 p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-sm text-purple-700">
              Contact Messages
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-700">
              {totalMessages}
            </p>

            <p className="mt-1 text-sm text-purple-600">
              {unreadMessages} unread
            </p>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow">
          <div className="grid gap-4 md:grid-cols-3">

            <div>
              <label
                htmlFor="article-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search Articles
              </label>

              <input
                id="article-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or author..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Category
              </label>

              <select
                id="category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>

                <option value="scheduled">
                  Scheduled
                </option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredArticles.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {totalArticles}
              </span>{" "}
              articles
            </p>

            {(search || category !== "all" || status !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setStatus("all");
                }}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Articles Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">

              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Image
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Published
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-gray-500"
                    >
                      No articles match your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-t transition hover:bg-slate-50"
                    >

                      {/* Image */}
                      <td className="p-4">
                        <div className="relative h-20 w-28 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={
                              article.image || "/placeholder.jpg"
                            }
                            alt={article.title}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="max-w-sm p-4">
                        <h3 className="font-bold text-gray-900">
                          {article.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {article.author || "Africana News"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                          {article.category || "Uncategorized"}
                        </span>
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
                            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                              Draft
                            </span>
                          )}

                          {article.breaking && (
                            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                              BREAKING
                            </span>
                          )}

                          {article.featured && (
                            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900">
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
                      <td className="whitespace-nowrap p-4 text-sm text-gray-600">
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

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteArticle(article.id)
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </main>
  );
}