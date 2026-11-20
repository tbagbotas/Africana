import Header from "../components/Header";
import Footer from "../components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 border-b border-gray-200 pb-5">
            <h1 className="text-4xl font-extrabold text-gray-950">Video News</h1>
            <p className="mt-2 text-gray-600">Watch the latest reports and interviews from Africana TV.</p>
          </div>

          {videos.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
              <p className="text-gray-500">No videos uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Link 
                  key={video.id} 
                  href={`/videos/${video.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-video bg-gray-200">
                    {video.thumbnail ? (
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Thumbnail
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-emerald-600 shadow-lg transition group-hover:scale-110">
                        ▶
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700">
                      {video.title}
                    </h2>
                    {video.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {video.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}