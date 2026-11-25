import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomeVideos() {
  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  if (videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-extrabold text-gray-950 sm:text-3xl">Latest Video Reports</h2>
        <Link href="/videos" className="font-semibold text-emerald-700 hover:underline">
          View All Videos →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video) => (
          <Link key={video.id} href={`/videos/${video.slug}`} className="group relative overflow-hidden rounded-xl bg-gray-900 shadow-md transition hover:shadow-xl">
            <div className="relative aspect-video w-full">
              <Image
                src={video.thumbnail || "/placeholder.jpg"}
                alt={video.title}
                fill
                className="object-cover object-top opacity-80 transition group-hover:opacity-100 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-lg">
                  ▶
                </div>
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-bold text-white">
                {video.duration || "Video"}
              </div>
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 text-base font-bold leading-tight text-white group-hover:text-yellow-400">
                {video.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}