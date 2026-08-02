import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Articles</h1>

            <p className="text-gray-600">
              Manage all published articles.
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            + New Article
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">

          <table className="min-w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Published</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500"
                  >
                    No articles found.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      {article.title}
                    </td>

                    <td className="p-4">
                      {article.category || "-"}
                    </td>

                    <td className="p-4">
                      {article.author || "-"}
                    </td>

                    <td className="p-4">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 flex gap-2">

                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Edit
                      </Link>

                      <DeleteButton id={article.id} />

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