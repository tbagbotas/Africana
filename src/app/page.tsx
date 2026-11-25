import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TrendingNews from "./components/TrendingNews";
import LatestNews from "./components/LatestNews";
import LiveTV from "./components/LiveTV";
import HomeVideos from "./components/HomeVideos";
import Newsletter from "./components/Newsletter";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch all published articles in one go
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  // 2. Assign them to sections without overlapping
  const heroArticle = articles[0];
  const trendingArticles = articles.slice(1, 7); // Next 6 articles
  const latestArticles = articles.slice(7, 19); // Next 12 articles

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Pass the single hero article to Hero */}
        {heroArticle && <Hero article={heroArticle} />}
        
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-3 py-8">
            <div className="lg:col-span-2">
              {/* Pass the specific trending articles */}
              <TrendingNews articles={trendingArticles} />
            </div>
            <div>
               {/* You can put a sidebar here later */}
            </div>
          </div>
        </div>

        <LatestNews articles={latestArticles} />
      <HomeVideos />
        <LiveTV />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}