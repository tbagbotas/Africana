"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface Video {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string | null;
  videoUrl: string;
  duration: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const categories = [
  "All Categories",
  "News Reports",
  "Interviews",
  "Documentaries",
  "Africa Focus",
  "Technology",
  "Politics",
  "Business",
  "Culture",
  "Sports",
];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  async function loadVideos() {
    try {
      const response = await fetch("/api/videos", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load videos.");
      }

      const data = await response.json();

      setVideos(Array.isArray(data.videos) ? data.videos : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadVideos();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function updateVideo(
    id: number,
    changes: {
      featured?: boolean;
      published?: boolean;
    }
  ) {
    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      const response = await fetch("/api/videos", {
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

      if (!response.ok) {
        throw new Error(data.error || "Failed to update video.");
      }

      setVideos((currentVideos) =>
        currentVideos.map((video) =>
          video.id === id
            ? {
                ...video,
                ...changes,
                ...(changes.published === true
                  ? {
                      publishedAt:
                        data.publishedAt ?? video.publishedAt,
                    }
                  : {}),
              }
            : video
        )
      );

      if (changes.published !== undefined) {
        setMessage(
          changes.published
            ? "Video published successfully."
            : "Video unpublished successfully."
        );
      } else if (changes.featured !== undefined) {
        setMessage(
          changes.featured
            ? "Video marked as featured."
            : "Video removed from featured."
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update video."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteVideo(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      const response = await fetch("/api/videos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete video.");
      }

      setVideos((currentVideos) =>
        currentVideos.filter((video) => video.id !== id)
      );

      setMessage("Video deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete video."
      );
    } finally {
      setActionLoading(null);
    }
  }

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        video.title.toLowerCase().includes(searchText) ||
        video.description.toLowerCase().includes(searchText) ||
        video.category.toLowerCase().includes(searchText);

      let matchesStatus = true;

      if (statusFilter === "published") {
        matchesStatus = video.published;
      }

      if (statusFilter === "draft") {
        matchesStatus = !video.published;
      }

      if (statusFilter === "featured") {
        matchesStatus = video.featured;
      }

      const matchesCategory =
        categoryFilter === "All Categories" ||
        video.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [videos, search, statusFilter, categoryFilter]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("All Categories");
  }

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "All Categories";

  const totalVideos = videos.length;

  const publishedVideos = videos.filter(
    (video) => video.published
  ).length;

  const draftVideos = videos.filter(
    (video) => !video.published
  ).length;

  const featuredVideos = videos.filter(
    (video) => video.featured
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
              Africana Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Videos
            </h1>

            <p className="mt-2 text-slate-600">
              Manage your video content, publishing status and
              featured videos.
            </p>
          </div>

          <a
            href="/admin/videos/upload"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            + Upload Video
          </a>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Videos
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalVideos}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {publishedVideos}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {draftVideos}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Featured
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {featuredVideos}
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div>
              <label
                htmlFor="video-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search
              </label>

              <input
                id="video-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search videos..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Showing {filteredVideos.length} of{" "}
                {videos.length} videos
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              Loading videos...
            </p>
          </div>
        ) : filteredVideos.length === 0 ? (

          /* Empty State */
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🎬
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No Videos Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {hasActiveFilters
                ? "Try changing your search or filters."
                : "You have not uploaded any videos yet."}
            </p>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Clear Filters
              </button>
            ) : (
              <a
                href="/admin/videos/upload"
                className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Upload Your First Video
              </a>
            )}
          </div>

        ) : (

          /* Video List */
          <div className="space-y-5">
            {filteredVideos.map((video) => {
              const isLoading = actionLoading === video.id;

              return (
                <article
                  key={video.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row">

                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full shrink-0 bg-slate-900 lg:w-80">

                      {video.thumbnail ? (
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 320px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <div className="text-center">
                            <div className="text-4xl">
                              ▶
                            </div>

                            <p className="mt-2 text-xs">
                              No Thumbnail
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex gap-2">
                        <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                          {video.category}
                        </span>

                        {video.duration && (
                          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                            {video.duration}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Video Information */}
                    <div className="flex min-w-0 flex-1 flex-col p-5">

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">
                          <h2 className="text-xl font-bold text-slate-900">
                            {video.title}
                          </h2>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                            {video.description}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">

                          {video.published ? (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                              Draft
                            </span>
                          )}

                          {video.featured && (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                              Featured
                            </span>
                          )}

                        </div>
                      </div>

                      {/* Dates */}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

                        <span>
                          Created{" "}
                          {new Date(
                            video.createdAt
                          ).toLocaleDateString()}
                        </span>

                        {video.publishedAt && (
                          <span>
                            Published{" "}
                            {new Date(
                              video.publishedAt
                            ).toLocaleDateString()}
                          </span>
                        )}

                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">

                        <a
                          href={`/videos/${video.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </a>

                        <a
                          href={`/admin/videos/edit/${video.id}`}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </a>

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            updateVideo(video.id, {
                              published: !video.published,
                            })
                          }
                          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLoading
                            ? "Saving..."
                            : video.published
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            updateVideo(video.id, {
                              featured: !video.featured,
                            })
                          }
                          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLoading
                            ? "Saving..."
                            : video.featured
                              ? "Remove Featured"
                              : "Make Featured"}
                        </button>

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            deleteVideo(video.id)
                          }
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>

                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}