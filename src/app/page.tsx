export const dynamic = "force-dynamic";
import Header from "./components/Header";
import BreakingNews from "./components/BreakingNews";
import Hero from "./components/Hero";
import TrendingNews from "./components/TrendingNews";
import LatestNews from "./components/LatestNews";
import LiveTV from "./components/LiveTV";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <BreakingNews />
      <Hero />
      <TrendingNews />
      <LatestNews />
      <LiveTV />
      <Newsletter />
      <Footer />
    </main>
  );
}