export default function LiveTV() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-6">
      <div className="overflow-hidden rounded-2xl bg-black text-white shadow-xl">
        {/* Header */}
        <div className="px-5 py-8 text-center sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold shadow-lg">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </span>

          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Africana Live TV
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Watch breaking news, interviews, documentaries, and live events
            from across Africa.
          </p>
        </div>

        {/* Video Area */}
        <div className="px-4 pb-5 sm:px-8 sm:pb-8">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gray-900">
            {/* Live Stream Placeholder */}
            <div className="px-5 text-center">
              <div className="mb-5 text-5xl sm:text-6xl">
                📺
              </div>

              <h3 className="text-xl font-bold sm:text-2xl">
                Live Stream Coming Soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base">
                Africana Live TV will be available here. Live news,
                interviews, documentaries, and special events will stream
                from this section.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Channel Offline
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}