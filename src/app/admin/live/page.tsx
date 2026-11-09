"use client";

import { useEffect, useState } from "react";

const streamPlatforms = [
  "YouTube Live",
  "Twitch",
  "Facebook Live",
  "KICK",
  "TikTok Live",
  "X Live",
  "Africana Stream / CDN",
  "HLS (.m3u8)",
  "Custom Stream",
];

const channelStatuses = [
  "LIVE",
  "OFFLINE",
  "STARTING SOON",
  "ENDED",
];

interface LiveTVSettings {
  id: number;
  platform: string;
  status: string;
  streamTitle: string;
  channelName: string | null;
  streamUrl: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLivePage() {
  const [platform, setPlatform] = useState("HLS (.m3u8)");
  const [status, setStatus] = useState("OFFLINE");
  const [streamTitle, setStreamTitle] = useState("Africana Live TV");
  const [streamUrl, setStreamUrl] = useState("");
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState(
    "Africana Live TV brings you breaking news, interviews, documentaries, special events and live coverage from Africa and around the world."
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSettings() {
    try {
      setError("");

      const response = await fetch("/api/live-tv", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load Live TV settings."
        );
      }

      const settings = data as LiveTVSettings;

      setPlatform(settings.platform);
      setStatus(settings.status);
      setStreamTitle(settings.streamTitle);
      setStreamUrl(settings.streamUrl || "");
      setChannelName(settings.channelName || "");
      setDescription(settings.description);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Live TV settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSettings();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function saveSettings(nextStatus?: string) {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const finalStatus = nextStatus ?? status;

      const response = await fetch("/api/live-tv", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          status: finalStatus,
          streamTitle,
          channelName,
          streamUrl,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save Live TV settings."
        );
      }

      setStatus(finalStatus);
      setMessage(
        finalStatus === "LIVE"
          ? "Africana Live TV is now LIVE."
          : finalStatus === "OFFLINE"
            ? "Africana Live TV is now OFFLINE."
            : "Live TV settings saved successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save Live TV settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function getStatusColor() {
    if (status === "LIVE") {
      return "bg-red-500";
    }

    if (status === "STARTING SOON") {
      return "bg-yellow-500";
    }

    if (status === "ENDED") {
      return "bg-orange-500";
    }

    return "bg-gray-400";
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            AFRICANA TV
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">
            Live TV Control
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            Control Africana Live TV from one place. Changes made here
            control the live channel shown on the homepage and the dedicated
            Live TV page.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-800">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-700" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading Live TV settings...
            </p>
          </div>
        ) : (
          <>
            {/* CURRENT STATUS */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                  Channel Status
                </p>
              </div>

              <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className={`h-4 w-4 rounded-full ${getStatusColor()} ${
                      status === "LIVE" ? "animate-pulse" : ""
                    }`}
                  />

                  <div>
                    <p className="text-2xl font-extrabold text-gray-950">
                      {status}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Platform:{" "}
                      <span className="font-semibold text-gray-700">
                        {platform}
                      </span>
                    </p>
                  </div>
                </div>

                {/* QUICK CONTROLS */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void saveSettings("LIVE")}
                    disabled={saving || !streamUrl}
                    className="rounded-xl bg-red-600 px-6 py-3 font-extrabold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving && status !== "LIVE"
                      ? "Updating..."
                      : "🔴 Go LIVE"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void saveSettings("OFFLINE")}
                    disabled={saving}
                    className="rounded-xl bg-gray-900 px-6 py-3 font-extrabold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving && status === "LIVE"
                      ? "Updating..."
                      : "⚫ Take Offline"}
                  </button>
                </div>
              </div>

              {!streamUrl && (
                <div className="border-t border-yellow-200 bg-yellow-50 px-6 py-4 text-sm font-semibold text-yellow-800">
                  Add a Stream URL before putting the channel LIVE.
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-xl font-extrabold text-gray-950">
                  Stream Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure the source and information displayed for Africana
                  Live TV.
                </p>
              </div>

              <div className="space-y-6 p-6">
                {/* PLATFORM */}
                <div>
                  <label
                    htmlFor="platform"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Streaming Platform
                  </label>

                  <select
                    id="platform"
                    value={platform}
                    onChange={(event) =>
                      setPlatform(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    {streamPlatforms.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STATUS */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Channel Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    {channelStatuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STREAM TITLE */}
                <div>
                  <label
                    htmlFor="stream-title"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Stream Title
                  </label>

                  <input
                    id="stream-title"
                    type="text"
                    value={streamTitle}
                    onChange={(event) =>
                      setStreamTitle(event.target.value)
                    }
                    placeholder="Africana Live TV"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* CHANNEL NAME */}
                <div>
                  <label
                    htmlFor="channel-name"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Channel / Account Name
                  </label>

                  <input
                    id="channel-name"
                    type="text"
                    value={channelName}
                    onChange={(event) =>
                      setChannelName(event.target.value)
                    }
                    placeholder="Africana News"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* STREAM URL */}
                <div>
                  <label
                    htmlFor="stream-url"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Stream URL
                  </label>

                  <input
                    id="stream-url"
                    type="text"
                    value={streamUrl}
                    onChange={(event) =>
                      setStreamUrl(event.target.value)
                    }
                    placeholder="https://.../video.m3u8"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    For HLS, use the .m3u8 playback URL.
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Channel Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={5}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* SAVE */}
                <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Save your changes
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      This updates the Live TV database used by viewers.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void saveSettings()}
                    disabled={saving}
                    className="rounded-xl bg-emerald-800 px-7 py-3 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Live TV Settings"}
                  </button>
                </div>
              </div>
            </div>

            {/* SUPPORTED SOURCES */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-gray-950">
                Supported Live Sources
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Select the source that provides your current broadcast.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {streamPlatforms.map((item) => (
                  <div
                    key={item}
                    className={`rounded-xl border px-4 py-4 transition ${
                      platform === item
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-gray-900">
                        {item}
                      </p>

                      {platform === item && (
                        <span className="rounded-full bg-emerald-700 px-2 py-1 text-[10px] font-extrabold uppercase text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}