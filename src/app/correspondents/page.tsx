import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CorrespondentsPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { author: true, title: true, slug: true, publishedAt: true },
  });

  const byAuthor = new Map<string, typeof articles>();
  for (const article of articles) {
    const name = article.author?.trim();
    if (!name) continue;
    const stories = byAuthor.get(name) ?? [];
    stories.push(article);
    byAuthor.set(name, stories);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="mb-8 border-b border-gray-200 pb-5">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Africana News Network</p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">Our Correspondents</h1>
          <p className="mt-3 max-w-2xl text-gray-600">Meet the journalists and contributors bringing you stories from across Africa and around the world.</p>
        </div>
        {byAuthor.size === 0 ? (
          <p className="rounded-xl bg-white p-6 text-gray-600 shadow">Correspondent profiles and reports will appear here as stories are published.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {[...byAuthor.entries()].map(([name, stories]) => (
              <article key={name} className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                <p className="mt-1 text-sm text-gray-500">{stories.length} published {stories.length === 1 ? "story" : "stories"}</p>
                <ul className="mt-4 space-y-3">
                  {stories.slice(0, 3).map((story) => (
                    <li key={story.slug}><Link href={`/article/${story.slug}`} className="font-semibold text-emerald-800 hover:underline">{story.title}</Link></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
