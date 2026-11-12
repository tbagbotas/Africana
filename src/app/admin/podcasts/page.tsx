"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Podcast {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  duration: string | null;
  featured: boolean;
  published: boolean;
  audioUrl: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminPodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchPodcasts() {
      try {
        const response = await fetch("/api/podcasts", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load podcasts.");
        }

        if (!cancelled) {
          setPodcasts(data.podcasts || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load podcasts."
          );
          setLoading(false);
        }
      }
    }

    void fetchPodcasts();

    return () => {
      cancelled = true;
    };
  }, []);

  async function updatePodcast(
    id: string,
    changes: {
      featured?: boolean;
      published?: boolean;
    }
  ) {
    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      const response = await fetch("/api/podcasts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...changes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update podcast.");
      }

      setMessage("Podcast updated successfully.");

      setPodcasts((current) =>
        current.map((podcast) =>
          podcast.id === id
            ? {
                ...podcast,
                ...changes,
              }
            : podcast
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update podcast."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function deletePodcast(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this podcast?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      const response = await fetch("/api/podcasts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete podcast.");
      }

      setPodcasts((current) =>
        current.filter((podcast) => podcast.id !== id)
      );

      setMessage("Podcast deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete podcast."
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
              AFRICANA AUDIO
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">
              Manage Podcasts
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Manage your uploaded podcast episodes, publishing status,
              featured podcasts, and podcast content.
            </p>
          </div>

          <a
            href="/admin/podcasts/upload"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-800 px-5 py-3 font-bold text-white transition hover:bg-emerald-900"
          >
            + Upload Podcast
          </a>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-700" />

            <p className="mt-4 font-semibold text-gray-600">
              Loading podcasts...
            </p>
          </div>
        ) : podcasts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="text-6xl">🎙️</div>

            <h2 className="mt-4 text-2xl font-extrabold text-gray-950">
              No Podcasts Yet
            </h2>

            <p className="mt-2 text-gray-600">
              Upload your first podcast episode to get started.
            </p>

            <a
              href="/admin/podcasts/upload"
              className="mt-6 inline-flex rounded-lg bg-emerald-800 px-6 py-3 font-bold text-white transition hover:bg-emerald-900"
            >
              Upload Podcast
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {podcasts.map((podcast) => (
              <article
                key={podcast.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col lg:flex-row">

                  <div className="relative aspect-video w-full overflow-hidden bg-emerald-900 lg:aspect-auto lg:w-72 lg:min-w-72">
                    {podcast.thumbnail ? (
                      <Image
                        src={podcast.thumbnail}
                        alt={podcast.title}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 288px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-48 items-center justify-center">
                        <span className="text-7xl">🎙️</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">
                        {podcast.category}
                      </span>

                      {podcast.featured && (
                        <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                          Featured
                        </span>
                      )}

                      {podcast.published ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                          Draft
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-extrabold text-gray-950">
                      {podcast.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-gray-600">
                      {podcast.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      {podcast.duration && (
                        <span>⏱ {podcast.duration}</span>
                      )}

                      {podcast.audioUrl && (
                        <span>🎙️ Audio</span>
                      )}

                      {podcast.videoUrl && (
                        <span>🎥 Video</span>
                      )}

                      {podcast.publishedAt && (
                        <span>
                          📅{" "}
                          {new Date(
                            podcast.publishedAt
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">

                      <a
                        href={`/podcasts/${podcast.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-gray-300 px-4 py-2 font-bold text-gray-800 transition hover:bg-gray-100"
                      >
                        View
                      </a>

                      <button
                        type="button"
                        disabled={actionLoading === podcast.id}
                        onClick={() =>
                          updatePodcast(podcast.id, {
                            published: !podcast.published,
                          })
                        }
                        className="rounded-lg bg-emerald-700 px-4 py-2 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {podcast.published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading === podcast.id}
                        onClick={() =>
                          updatePodcast(podcast.id, {
                            featured: !podcast.featured,
                          })
                        }
                        className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {podcast.featured
                          ? "Remove Featured"
                          : "Make Featured"}
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading === podcast.id}
                        onClick={() => deletePodcast(podcast.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}