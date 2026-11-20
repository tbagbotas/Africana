import Header from "../components/Header";
import Footer from "../components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PodcastsPage() {
  const podcasts = await prisma.podcast.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 border-b border-gray-200 pb-5">
            <h1 className="text-4xl font-extrabold text-gray-950">Podcasts</h1>
            <p className="mt-2 text-gray-600">Listen to in-depth conversations and analysis from Africana TV.</p>
          </div>

          {podcasts.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
              <p className="text-gray-500">No podcasts uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((podcast) => (
                <Link 
                  key={podcast.id} 
                  href={`/podcasts/${podcast.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-square bg-gray-200">
                    {podcast.thumbnail ? (
                      <Image
                        src={podcast.thumbnail}
                        alt={podcast.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        🎙️ No Cover
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700">
                      {podcast.title}
                    </h2>
                    {podcast.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {podcast.description}
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