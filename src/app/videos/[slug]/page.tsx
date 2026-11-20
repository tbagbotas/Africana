import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function VideoPlayerPage({ params }: PageProps) {
  const { slug } = await params;

  const video = await prisma.video.findUnique({
    where: { slug },
  });

  if (!video) {
    notFound();
  }

  // Check if the URL is a YouTube or Vimeo link
  const isEmbed = video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be") || video.videoUrl.includes("vimeo.com");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          
          <Link href="/videos" className="mb-6 inline-block font-semibold text-emerald-700 hover:underline">
            ← Back to Videos
          </Link>

          <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
            <div className="relative aspect-video w-full">
              {isEmbed ? (
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  className="absolute inset-0 h-full w-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg sm:p-10">
            <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">
              {video.title}
            </h1>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📅 {new Date(video.createdAt).toLocaleDateString("en-GB")}</span>
            </div>

            {video.description && (
              <p className="mt-6 whitespace-pre-line text-lg leading-8 text-gray-700">
                {video.description}
              </p>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}