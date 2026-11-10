import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const correspondent = await prisma.correspondent.findUnique({
    where: { slug },
    select: { name: true, bio: true },
  });

  return correspondent
    ? {
        title: `${correspondent.name} | AFRICANA`,
        description:
          correspondent.bio || `${correspondent.name}, AFRICANA correspondent.`,
      }
    : { title: "Author Not Found | AFRICANA" };
}

const publishedFilter = {
  published: true,
  OR: [
    { status: "published" },
    { status: "scheduled", publishedAt: { lte: new Date() } },
  ],
};

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const correspondent = await prisma.correspondent.findUnique({
    where: { slug },
  });

  if (!correspondent) notFound();

  const articles = await prisma.article.findMany({
    where: { correspondentId: correspondent.id, ...publishedFilter },
    orderBy: { publishedAt: "desc" },
    select: {
      title: true,
      slug: true,
      category: true,
      image: true,
      publishedAt: true,
    },
  });

  const role = correspondent.specialization?.trim() || "AFRICANA Correspondent";
  const bio =
    correspondent.bio?.trim() ||
    `${correspondent.name} is an AFRICANA correspondent${
      correspondent.specialization?.trim()
        ? ` covering ${correspondent.specialization.trim()}`
        : ""
    }${correspondent.country?.trim() ? `, based in ${correspondent.country.trim()}` : ""}.`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: correspondent.name,
    jobTitle: role,
    description: bio,
    url: `https://www.africanatv.com/author/${correspondent.slug}`,
    image: correspondent.photo || undefined,
    worksFor: { "@type": "Organization", name: "AFRICANA TV" },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <main className="min-h-screen bg-gray-100">
        <section className="bg-emerald-900 px-4 py-12 text-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center">
            {correspondent.photo && (
              <Image
                src={correspondent.photo}
                alt={correspondent.name}
                width={112}
                height={112}
                className="h-28 w-28 rounded-full object-cover"
                unoptimized
              />
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">AFRICANA correspondent</p>
              <h1 className="mt-2 text-4xl font-extrabold">{correspondent.name}</h1>
              <p className="mt-2 font-semibold text-emerald-100">{role}</p>
              <p className="mt-3 max-w-3xl leading-7 text-emerald-50">{bio}</p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Articles by {correspondent.name}</h2>
          {articles.length === 0 ? (
            <p className="mt-6 text-gray-600">No published articles are currently listed for this correspondent.</p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="overflow-hidden rounded-xl bg-white shadow">
                  {article.image && (
                    <Link href={`/article/${article.slug}`} aria-label={article.title}>
                      <Image src={article.image} alt={article.title} width={640} height={360} className="h-48 w-full object-cover" unoptimized />
                    </Link>
                  )}
                  <div className="p-5">
                    <p className="text-sm font-semibold text-emerald-800">{article.category || "Africa"}</p>
                    <h3 className="mt-2 text-xl font-bold leading-snug text-gray-900">
                      <Link className="hover:text-emerald-800" href={`/article/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <time className="mt-3 block text-sm text-gray-500" dateTime={article.publishedAt.toISOString()}>
                      {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
