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
    <section className="bg-red-700 text-white border-y-4 border-red-800 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center">

        {/* LIVE Badge */}
        <div className="flex items-center bg-black px-6 py-4 font-bold text-sm whitespace-nowrap">
          <span className="animate-pulse mr-2">🔴</span>
          LIVE
        </div>

        {/* Scrolling Headlines */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex whitespace-nowrap py-4 animate-marquee"
            style={{ width: "max-content" }}
          >
            {[...headlines, ...headlines].map((article, index) => (
              <Link
                key={`${article.id}-${index}`}
                href={`/article/${article.slug}`}
                className="mx-8 hover:text-yellow-300 transition font-semibold"
              >
                📰 {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }

        @keyframes marquee {
          from {
            transform: translateX(0%);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}