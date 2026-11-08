export const dynamic = "force-dynamic";

import Header from "./components/Header";
import BreakingNews from "./components/BreakingNews";
import Hero from "./components/Hero";
import TrendingNews from "./components/TrendingNews";
import LatestNews from "./components/LatestNews";
import LiveTV from "./components/LiveTV";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <BreakingNews />
      <Hero />
      <TrendingNews />
      <LatestNews />
      <LiveTV />
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="rounded-2xl bg-emerald-900 p-6 text-white shadow-xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">Independent African journalism</p>
          <h2 className="mt-2 text-3xl font-extrabold">Support Africana TV</h2>
          <p className="mt-4 max-w-3xl leading-7 text-emerald-50">Help us continue producing independent African journalism, video reports, live broadcasts, podcasts and stories from Africa and around the world.</p>
          <p className="mt-3 max-w-3xl leading-7 text-emerald-100">Every contribution helps support journalism, reporting, technology and the continued development of Africana TV.</p>
          <Link href="/donate" className="mt-6 inline-flex rounded-lg bg-yellow-400 px-5 py-3 font-bold text-gray-950 transition hover:bg-yellow-300">Support Africana TV →</Link>
        </div>
      </section>
      <Newsletter />
      <Footer />
    </main>
  );
}
