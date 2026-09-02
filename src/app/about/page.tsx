import Link from "next/link";

export const metadata = {
  title: "About Us | AFRICANA",
  description:
    "Learn more about AFRICANA, Africa's Global News Network.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-emerald-900 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
            ABOUT AFRICANA
          </span>

          <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Africa&apos;s Global News Network
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-emerald-50 sm:text-xl">
            AFRICANA brings Africa&apos;s stories to audiences around the
            world, covering the people, ideas, businesses, events, and
            developments shaping Africa and the world.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Who We Are */}
          <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-8">
            <div className="text-4xl">🌍</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Who We Are
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              AFRICANA is a news platform focused on delivering stories from
              across Africa and connecting African perspectives with a global
              audience.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Our coverage includes Africa, business, politics, technology,
              sports, entertainment, climate, world news, videos, podcasts,
              and breaking developments.
            </p>
          </div>

          {/* Our Mission */}
          <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-8">
            <div className="text-4xl">📰</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Our Mission
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Our mission is to make important African stories accessible,
              engaging, and easy to discover while providing a platform for
              stories that matter to communities across the continent.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              We aim to cover developments across Africa while also bringing
              African perspectives to global conversations.
            </p>
          </div>

          {/* What We Cover */}
          <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-8">
            <div className="text-4xl">📡</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              What We Cover
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:text-base">
              {[
                "Africa",
                "Business",
                "Politics",
                "Technology",
                "Sports",
                "World",
                "Entertainment",
                "Climate",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg bg-emerald-50 px-4 py-3 font-semibold text-emerald-800"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Our Vision */}
          <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-8">
            <div className="text-4xl">🚀</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Our Vision
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              We envision AFRICANA becoming a trusted destination for African
              news, stories, analysis, video, and live coverage for readers
              across Africa and around the world.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              From breaking news to in-depth stories, we want AFRICANA to help
              audiences better understand Africa and its place in the world.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10 rounded-2xl bg-emerald-700 p-8 text-center text-white shadow-xl sm:p-10">
          <h2 className="text-3xl font-extrabold">
            Stay Connected With AFRICANA
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-emerald-50">
            Explore our latest stories, trending news, videos, podcasts, and
            live coverage from across Africa.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/latest"
              className="rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              Latest News
            </Link>

            <Link
              href="/trending"
              className="rounded-lg bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-900"
            >
              Trending News
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}