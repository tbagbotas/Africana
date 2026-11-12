import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BreakingNews() {
  const headlines = await prisma.article.findMany({
    where: {
      published: true,
      breaking: true,
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
        {/* Breaking Label */}
        <div className="z-10 flex items-center whitespace-nowrap bg-black px-5 py-4 text-sm font-extrabold sm:px-6">
          <span className="mr-2 animate-pulse text-red-500">●</span>
          BREAKING NEWS
        </div>

        {/* News Ticker */}
        <div className="relative flex-1 overflow-hidden">
          <div className="marquee">
            <div className="marquee-track">
              <div className="marquee-group">
                {headlines.map((article) => (
                  <Link
                    key={`first-${article.id}`}
                    href={`/article/${article.slug}`}
                    className="font-semibold transition hover:text-yellow-300"
                  >
                    NEWS — {article.title}
                  </Link>
                ))}
              </div>

              <div className="marquee-group" aria-hidden="true">
                {headlines.map((article) => (
                  <Link
                    key={`second-${article.id}`}
                    href={`/article/${article.slug}`}
                    tabIndex={-1}
                    className="font-semibold transition hover:text-yellow-300"
                  >
                    NEWS — {article.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .marquee {
          overflow: hidden;
          padding: 1rem 0;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }

        .marquee-group {
          display: flex;
          flex-shrink: 0;
        }

        .marquee-group a {
          flex-shrink: 0;
          margin: 0 2rem;
        }

        .marquee:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}