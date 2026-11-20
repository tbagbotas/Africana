import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PodcastPlayerPage({ params }: PageProps) {
  const { slug } = await params;

  const podcast = await prisma.podcast.findUnique({
    where: { slug },
  });

  if (!podcast) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          
          <Link href="/podcasts" className="mb-6 inline-block font-semibold text-emerald-700 hover:underline">
            ← Back to Podcasts
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-10 text-center">
            {podcast.thumbnail && (
              <div className="relative mx-auto mb-8 aspect-square w-full max-w-sm overflow-hidden rounded-xl shadow-md">
                <Image
                  src={podcast.thumbnail}
                  alt={podcast.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">
              {podcast.title}
            </h1>
            
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>📅 {new Date().toLocaleDateString("en-GB")}</span>
            </div>

            {podcast.description && (
              <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-lg leading-8 text-gray-700">
                {podcast.description}
              </p>
            )}

            {podcast.audioUrl && (
              <div className="mt-10 w-full overflow-hidden rounded-xl bg-gray-50 p-4">
                <audio 
                  src={podcast.audioUrl} 
                  controls 
                  className="w-full"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}