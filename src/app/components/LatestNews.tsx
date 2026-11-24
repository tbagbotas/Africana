import Image from "next/image";
import Link from "next/link";

export default function LatestNews({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-950">Latest News</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article key={article.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
            <Link href={`/article/${article.slug}`} className="relative aspect-video overflow-hidden">
              <Image
                src={article.image || "/placeholder.jpg"}
                alt={article.title}
                fill
                className="object-cover object-top transition duration-500 group-hover:scale-105"
                unoptimized
              />
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">{article.category}</span>
              <h3 className="mt-2 text-xl font-bold leading-tight text-gray-900">
                <Link href={`/article/${article.slug}`} className="hover:text-emerald-700">{article.title}</Link>
              </h3>
              
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>By {article.author || "Africana News"}</span>
                {article.location && <span>•</span>}
                {article.location && <span>{article.location}</span>}
                <span>•</span>
                <span>{article.readTime || "5 min"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}