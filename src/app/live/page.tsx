import type { Metadata } from "next";
import Link from "next/link";

import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTV from "../components/LiveTV";

export const metadata: Metadata = {
  title: "Live TV | Africana",
  description: "Watch Africana Television for live reports and broadcasts from Africa.",
};

export default function LivePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          Africana TV
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">
          Live Television
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">
          Watch Africana&apos;s live broadcasts and video reports from across Africa.
        </p>
      </section>

      <LiveTV />

      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-6">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-gray-600">
            When a broadcast is not live, check back here for the next stream.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Africana
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
