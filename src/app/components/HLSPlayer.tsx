"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

type HLSPlayerProps = {
  src: string;
  title?: string;
};

export default function HLSPlayer({ src, title = "Africana Live TV" }: HLSPlayerProps) {
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

      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-5 text-center text-white">
          <p className="rounded-xl bg-black/80 px-6 py-5 text-sm font-semibold">Connecting to Africana Live TV…</p>
        </div>
      )}

      {error && (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 px-5 text-center text-white">
          <div className="mb-4 text-4xl" aria-hidden="true">📺</div>
          <h3 className="text-lg font-bold sm:text-xl">Live stream unavailable</h3>
          <p className="mt-2 max-w-md text-sm text-gray-300">{error}</p>
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
