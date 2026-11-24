import Image from "next/image";
import Link from "next/link";

export default function Hero({ article }: { article: any }) {
  if (!article) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-6">
      <article className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
        <div className="relative aspect-video w-full lg:aspect-[21/9]">
          <Image
            src={article.image || "/placeholder.jpg"}
            alt={article.title}
            fill
            priority
            className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {article.category}
              </span>
              {article.breaking && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  BREAKING
                </span>
              )}
            </div>

            <h1 className="max-w-4xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              <Link href={`/article/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h1>

            <p className="mt-3 max-w-3xl line-clamp-2 hidden text-gray-200 sm:block sm:text-lg">
              {article.excerpt}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-300 sm:text-sm">
              <span>By {article.author || "Africana News"}</span>
              {article.location && <span>•</span>}
              {article.location && <span>{article.location}</span>}
              <span>•</span>
              <span>{article.readTime || "5 min"}</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}