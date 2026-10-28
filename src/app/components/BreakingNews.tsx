import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BreakingNews() {
  const headlines = await prisma.article.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 8,
  });

  if (headlines.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden border-y-4 border-emerald-700 bg-emerald-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="z-10 flex items-center whitespace-nowrap bg-black px-5 py-4 text-sm font-bold sm:px-6">
          <span className="mr-2 animate-pulse text-red-500">●</span>
          LIVE
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="marquee">
            {headlines.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="mx-8 font-semibold transition hover:text-yellow-300"
              >
                📰 {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee {
          display: flex;
          width: max-content;
          white-space: nowrap;
          padding: 1rem 0;
          animation: marquee 30s linear infinite;
        }

        @keyframes marquee {
          from {
            transform: translateX(100%);
          }

          to {
            transform: translateX(-100%);
          }
        }

        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}