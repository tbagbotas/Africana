import { prisma } from "@/lib/prisma";
import HLSPlayer from "@/app/components/HLSPlayer";

export default async function LiveTV() {
  const liveTV = await prisma.liveTV.findFirst({
    orderBy: { id: "desc" },
  });

  const status = liveTV?.status?.toUpperCase() ?? "OFFLINE";
  const isLive = status === "LIVE";
  const streamUrl = liveTV?.streamUrl ?? "";
  const streamTitle = liveTV?.streamTitle || "Africana Live TV";

  return (
    <section className="mx-auto -mt-3 w-full max-w-[1600px] px-3 pb-0 pt-0 sm:-mt-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-[#07110d] shadow-[0_16px_50px_rgba(0,0,0,0.16)] sm:rounded-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-700 via-emerald-400 to-yellow-400" />

        <div className="overflow-hidden bg-black">
          <div className="relative aspect-video w-full bg-black">
            {isLive && streamUrl ? (
              <HLSPlayer src={streamUrl} title={streamTitle} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#080d0b] px-5 text-center">
                <div className="max-w-lg">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-2xl font-black text-emerald-300 sm:h-20 sm:w-20">
                    TV
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                    Africana Television
                  </p>

                  <h2 className="mt-3 text-xl font-black text-white sm:text-3xl">
                    {status === "STARTING SOON"
                      ? "Broadcast Starting Soon"
                      : status === "ENDED"
                        ? "Broadcast Has Ended"
                        : "Live Broadcast Offline"}
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
                    {status === "STARTING SOON"
                      ? "Our live broadcast will begin shortly. Please stay tuned."
                      : status === "ENDED"
                        ? "This live broadcast has ended. Visit us again for our next programme."
                        : "Africana Live TV is currently offline. Please check back soon."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}