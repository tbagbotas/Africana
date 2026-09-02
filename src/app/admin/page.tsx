import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("africana_admin");

  if (!adminCookie?.value) {
    redirect("/admin/login");
  }

  const userId = Number(adminCookie.value);

  if (!Number.isInteger(userId)) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    totalMessages,
    unreadMessages,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({
      where: {
        published: true,
      },
    }),
    prisma.article.count({
      where: {
        status: "draft",
      },
    }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({
      where: {
        read: false,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-700">
              AFRICANA
            </h1>

            <p className="text-sm text-gray-500">
              Admin Dashboard
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View Website
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {user.name || "Admin"}
          </h2>

          <p className="mt-2 text-gray-600">
            Manage your Africana news website from here.
          </p>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm font-semibold text-gray-500">
              Total Articles
            </p>

            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              {totalArticles}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm font-semibold text-gray-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-extrabold text-emerald-700">
              {publishedArticles}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm font-semibold text-gray-500">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-extrabold text-amber-600">
              {draftArticles}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm font-semibold text-gray-500">
              Messages
            </p>

            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              {totalMessages}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm font-semibold text-gray-500">
              Unread
            </p>

            <p className="mt-2 text-3xl font-extrabold text-red-600">
              {unreadMessages}
            </p>
          </div>
        </div>

        {/* Management */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900">
            Manage Africana
          </h3>

          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <Link
              href="/admin/articles"
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold text-gray-900">
                Articles
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                Create, edit, publish and manage news articles.
              </p>

              <span className="mt-5 inline-block text-sm font-bold text-emerald-700">
                Manage Articles →
              </span>
            </Link>

            <Link
              href="/admin/articles/new"
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold text-gray-900">
                New Article
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                Create a new Africana news article.
              </p>

              <span className="mt-5 inline-block text-sm font-bold text-emerald-700">
                Create Article →
              </span>
            </Link>

            <Link
              href="/admin/messages"
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold text-gray-900">
                Messages
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                View messages submitted through the contact page.
              </p>

              <span className="mt-5 inline-block text-sm font-bold text-emerald-700">
                View Messages →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}