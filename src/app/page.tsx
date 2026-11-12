export const dynamic = "force-dynamic";

import Link from "next/link";
import Header from "./components/Header";
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

      <Hero />
      <TrendingNews />
      <LatestNews />
      
      <LiveTV />

      {/* Support Africana TV */}
      <section className="bg-green-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-4 text-4xl">❤️</div>

          <h2 className="text-3xl font-bold md:text-4xl">
            Support Africana TV
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-green-50">
            Help us continue producing independent African journalism,
            video reports, live broadcasts, podcasts and stories from
            Africa and around the world.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-green-100">
            Every contribution helps support journalism, reporting,
            technology and the continued development of Africana TV.
          </p>

          <Link
            href="/donate"
            className="mt-8 inline-flex items-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-green-900 shadow-lg transition hover:bg-green-50"
          >
            Support Africana TV →
          </Link>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}