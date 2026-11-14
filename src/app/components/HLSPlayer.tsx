"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import type { StreamingPlatform } from "@/config/streaming";
import StreamingPlatformLinks from "@/app/components/StreamingPlatformLinks";

type HLSPlayerProps = {
  src: string;
  title?: string;
  fallbackLinks?: StreamingPlatform[];
};

export default function HLSPlayer({ src, title = "Africana Live TV", fallbackLinks = [] }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let disposed = false;
    let hls: Hls | null = null;

    const showError = (message: string) => {
      if (disposed) return;
      setLoading(false);
      setError(message);
    };

    const onNativeReady = () => {
      if (!disposed) setLoading(false);
    };
    const onNativeError = () => {
      showError("The live stream could not be played. Check that Cloudflare Stream is receiving a broadcast, then retry.");
    };

    setLoading(true);
    setError(null);
    video.addEventListener("canplay", onNativeReady);
    video.addEventListener("error", onNativeError);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari && Hls.isSupported()) {
      hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        lowLatencyMode: true,
        enableWorker: true,
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!disposed) setLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal || disposed) return;

        console.error("[Africana Live TV] Fatal HLS playback error", {
          type: data.type,
          details: data.details,
          responseCode: data.response?.code,
        });

        if (data.response?.code === 204) {
          showError("Cloudflare Stream has not started receiving a broadcast. Start the stream in OBS, then retry.");
        } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          showError("The stream could not be reached. Check the stream URL and retry.");
        } else {
          showError("The stream could not be decoded. Retry or open it on the streaming provider.");
        }
      });

      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.load();
    } else {
      showError("This browser cannot play HLS video. Open the stream on the provider instead.");
    }

    return () => {
      disposed = true;
      video.removeEventListener("canplay", onNativeReady);
      video.removeEventListener("error", onNativeError);
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [attempt, src]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <video
        ref={videoRef}
        title={title}
        className="absolute inset-0 h-full w-full bg-black object-contain"
        controls
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-label={title}
      />

      {!loading && !error && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 z-30 sm:left-4 sm:top-4">
            <div className="flex items-center gap-2 rounded-md bg-emerald-900/95 px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-white shadow-xl sm:px-4 sm:py-2 sm:text-sm">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-full w-full rounded-full bg-red-500" />
              </span>
              LIVE
            </div>
          </div>
          <div className="pointer-events-none absolute right-3 top-3 z-30 text-right sm:right-4 sm:top-4">
            <div className="inline-flex overflow-hidden rounded-md shadow-2xl">
              <span className="bg-emerald-950 px-2.5 py-1.5 text-sm font-black tracking-tight text-white sm:px-4 sm:py-2 sm:text-2xl">AFRICANA</span>
              <span className="bg-yellow-400 px-2 py-1.5 text-sm font-black text-black sm:px-3 sm:py-2 sm:text-2xl">TV</span>
            </div>
            <p className="mt-1 text-[7px] font-bold tracking-[0.2em] text-white drop-shadow-lg sm:text-[10px] sm:tracking-[0.25em]">AFRICA • STORIES • WORLD</p>
          </div>
          <div className="pointer-events-none absolute bottom-12 left-0 right-0 z-30 sm:bottom-14">
            <div className="mx-2 sm:mx-5">
              <div className="inline-flex items-center bg-emerald-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white shadow-lg sm:px-6 sm:py-2 sm:text-sm">
                <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Breaking News
              </div>
              <div className="border-l-4 border-yellow-400 bg-white px-3 py-2 shadow-2xl sm:px-6 sm:py-4">
                <h2 className="text-sm font-black uppercase leading-tight text-gray-950 sm:text-2xl lg:text-3xl">Africa Shaping a Brighter Tomorrow</h2>
                <p className="mt-1 text-[9px] font-semibold text-gray-600 sm:text-sm">
                  Latest news • In-depth analysis • Exclusive interviews • From Africa and around the world
                </p>
              </div>
              <div className="flex overflow-hidden bg-emerald-950 text-white shadow-xl">
                <div className="shrink-0 bg-yellow-400 px-2 py-1.5 text-[9px] font-black uppercase text-black sm:px-5 sm:py-2 sm:text-xs">Top Stories</div>
                <div className="live-tv-ticker flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap">
                  <div className="live-tv-ticker-track px-4 text-[9px] font-semibold sm:text-xs">
                    Africa calls for stronger climate action<span className="mx-4 text-yellow-400">|</span>
                    Global leaders meet on economic growth<span className="mx-4 text-yellow-400">|</span>
                    Innovation driving change across Africa<span className="mx-4 text-yellow-400">|</span>
                    African businesses accelerate digital growth<span className="mx-4 text-yellow-400">|</span>
                    Sports and entertainment updates
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style>{'@keyframes live-tv-marquee{from{transform:translateX(0)}to{transform:translateX(-55%)}}.live-tv-ticker-track{display:inline-block;min-width:max-content;animation:live-tv-marquee 35s linear infinite}@media(prefers-reduced-motion:reduce){.live-tv-ticker-track{animation:none}}'}</style>
        </>
      )}

      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-5 text-center text-white">
          <p className="rounded-xl bg-black/80 px-6 py-5 text-sm font-semibold">Connecting to Africana Live TV…</p>
        </div>
      )}

      {error && (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 px-5 text-center text-white">
          <div className="mb-4 text-4xl" aria-hidden="true">📺</div>
          <h3 className="text-lg font-bold sm:text-xl">Live stream unavailable</h3>
          <p className="mt-2 max-w-md text-sm text-gray-300">
            The stream is offline. Check our social channels for updates.
          </p>
          <StreamingPlatformLinks platforms={fallbackLinks} className="mt-4" />
          <p className="mt-3 max-w-md text-xs text-gray-400">{error}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
                setAttempt((current) => current + 1);
              }}
              className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Try again
            </button>
            <a href={src} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-500 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
              Open stream
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
