import type { StreamingPlatform } from "@/config/streaming";

type StreamingPlatformLinksProps = {
  platforms: StreamingPlatform[];
  className?: string;
};

export default function StreamingPlatformLinks({
  platforms,
  className = "",
}: StreamingPlatformLinksProps) {
  const available = platforms.filter((platform) => platform.url.trim().length > 0);
  if (available.length === 0) return null;

  return (
    <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 ${className}`}>
      {available.map((platform) => (
        <a
          key={platform.id}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/60 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          <span aria-hidden="true" className="flex h-5 min-w-5 items-center justify-center font-black">
            {platform.mark}
          </span>
          <span>{platform.name}</span>
        </a>
      ))}
    </div>
  );
}
