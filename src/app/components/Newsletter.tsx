export default function Newsletter() {
  return (
    <section className="bg-emerald-700 text-white py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">
          Subscribe to Africana
        </h2>

        <p className="mt-4 text-lg">
          Get breaking news, exclusive reports, and daily headlines delivered
          to your inbox.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg text-black w-full sm:w-96"
          />

          <button className="bg-black hover:bg-gray-900 px-6 py-3 rounded-lg font-bold">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}