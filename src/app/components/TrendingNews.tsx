import Image from "next/image";
import Link from "next/link";

export default function TrendingNews({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Trending Today</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article, index) => (
          <article key={article.id} className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
            <Link href={`/article/${article.slug}`}>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image || "/placeholder.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white shadow-md">
                    #{index + 1} TRENDING
                  </span>
                </div>
              </div>
            </Link>
            <div className="p-4">
              <span className="text-xs font-bold uppercase text-emerald-600">{article.category}</span>
              <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight">
                <Link href={`/article/${article.slug}`}>{article.title}</Link>
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}