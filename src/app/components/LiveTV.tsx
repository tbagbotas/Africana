export default function LiveTV() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-6">
      <div className="overflow-hidden rounded-2xl bg-black text-white shadow-xl">
        <div className="px-5 py-8 text-center sm:px-10 sm:py-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">TV</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Africana Television</h2>
        </div>
        <div className="px-4 pb-5 sm:px-8 sm:pb-8">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gray-900">
            <div className="px-5 text-center">
              <div className="mb-5 text-5xl sm:text-6xl" aria-hidden="true">📺</div>
              <h3 className="text-xl font-bold sm:text-2xl">Broadcast Starting Soon</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">Our live broadcast will begin shortly. Please stay tuned.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
