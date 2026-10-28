export default function Newsletter() {
  return (
    <section className="bg-emerald-700 py-14 text-white sm:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
          NEWSLETTER
        </span>

        <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
          Subscribe to Africana
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-50 sm:text-lg">
          Get breaking news, exclusive reports, and daily headlines delivered
          straight to your inbox.
        </p>

        <form
          action="#"
          method="post"
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            aria-label="Email address"
            autoComplete="email"
            required
            className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-emerald-700"
          >
            Subscribe
          </button>
        </form>

        <p className="mt-4 text-xs text-emerald-100">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}