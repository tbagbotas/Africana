"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const categories = [
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
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditVideoPage({ params }: PageProps) {
  const [videoId, setVideoId] = useState<number | null>(null);
  const [video, setVideo] = useState<Video | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");

  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadVideo() {
      try {
        const { id } = await params;
        const parsedId = Number(id);

        if (!Number.isInteger(parsedId)) {
          throw new Error("Invalid video ID.");
        }

        setVideoId(parsedId);

        const response = await fetch("/api/videos", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load videos."
          );
        }

        const foundVideo = data.videos?.find(
          (item: Video) => item.id === parsedId
        );

        if (!foundVideo) {
          throw new Error("Video not found.");
        }

        if (!cancelled) {
          setVideo(foundVideo);
          setTitle(foundVideo.title);
          setDescription(foundVideo.description);
          setCategory(foundVideo.category);
          setDuration(foundVideo.duration || "");
          setFeatured(foundVideo.featured);
          setPublished(foundVideo.published);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load video."
          );
          setLoading(false);
        }
      }
    }

    void loadVideo();

    return () => {
      cancelled = true;
    };
  }, [params]);

  function handleVideoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setVideoFile(event.target.files?.[0] || null);
  }

  function handleThumbnailChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setThumbnailFile(event.target.files?.[0] || null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!videoId) {
      setError("Video ID is missing.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.set("id", String(videoId));
      formData.set("title", title.trim());
      formData.set("description", description.trim());
      formData.set("category", category);
      formData.set("duration", duration.trim());
      formData.set("featured", String(featured));
      formData.set("published", String(published));

      if (videoFile) {
        formData.set("video", videoFile);
      }

      if (thumbnailFile) {
        formData.set("thumbnail", thumbnailFile);
      }

      const response = await fetch("/api/videos", {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update video."
        );
      }

      setVideo(data.video);
      setTitle(data.video.title);
      setDescription(data.video.description);
      setCategory(data.video.category);
      setDuration(data.video.duration || "");
      setFeatured(data.video.featured);
      setPublished(data.video.published);

      setVideoFile(null);
      setThumbnailFile(null);

      setMessage("Video updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update video."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-700" />

          <p className="mt-4 font-semibold text-gray-600">
            Loading video...
          </p>
        </div>
      </main>
    );
  }

  if (!video) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-extrabold text-gray-950">
            Video Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            {error || "The requested video could not be found."}
          </p>

          <Link
            href="/admin/videos"
            className="mt-6 inline-flex rounded-lg bg-emerald-800 px-6 py-3 font-bold text-white transition hover:bg-emerald-900"
          >
            ← Back to Manage Videos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/videos"
            className="font-semibold text-emerald-700 transition hover:text-emerald-900"
          >
            ← Back to Manage Videos
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-emerald-700">
            AFRICANA VIDEO
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">
            Edit Video
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Update the video information, media files, and publishing
            settings.
          </p>
        </div>

        {/* SUCCESS */}
        {message && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* VIDEO INFORMATION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-gray-950">
                Video Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update the basic information for this video.
              </p>
            </div>

            {/* TITLE */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-gray-900"
              >
                Video Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-5">
              <label
                htmlFor="description"
                className="block text-sm font-bold text-gray-900"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                className="mt-2 block w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* CATEGORY + DURATION */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-gray-900"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  required
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="" disabled>
                    Select a category
                  </option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-bold text-gray-900"
                >
                  Duration
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                  placeholder="Example: 05:00"
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

            </div>
          </section>

          {/* CURRENT MEDIA */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-gray-950">
                Current Media
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This is the media currently connected to this video.
              </p>
            </div>

            {/* CURRENT THUMBNAIL */}
            {video.thumbnail && (
              <div>
                <p className="mb-3 text-sm font-bold text-gray-900">
                  Current Thumbnail
                </p>

                <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl bg-gray-900">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 576px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* CURRENT VIDEO */}
            <div className={video.thumbnail ? "mt-6" : ""}>
              <p className="mb-3 text-sm font-bold text-gray-900">
                Current Video
              </p>

              <div className="overflow-hidden rounded-xl bg-black">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={video.thumbnail || undefined}
                  className="h-auto max-h-150 w-full"
                  src={video.videoUrl}
                >
                  Your browser does not support the video player.
                </video>
              </div>
            </div>

          </section>

          {/* REPLACE MEDIA */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-gray-950">
                Replace Media
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Leave these fields empty if you want to keep the existing
                media.
              </p>
            </div>

            {/* VIDEO */}
            <div className="rounded-xl border-2 border-emerald-700 bg-white p-5">

              <label
                htmlFor="video"
                className="block text-sm font-bold text-gray-900"
              >
                🎥 Replace Video
              </label>

              <p className="mt-1 text-sm text-gray-500">
                MP4 is recommended for the best browser compatibility.
              </p>

              <input
                id="video"
                name="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="mt-4 block w-full text-sm text-gray-700"
              />

              {videoFile && (
                <div className="mt-3 rounded-lg bg-emerald-50 px-4 py-3">
                  <p className="font-bold text-emerald-700">
                    ✓ New video selected
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-600">
                    {videoFile.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

            </div>

            {/* THUMBNAIL */}
            <div className="mt-5 rounded-xl border-2 border-gray-300 bg-white p-5">

              <label
                htmlFor="thumbnail"
                className="block text-sm font-bold text-gray-900"
              >
                🖼️ Replace Thumbnail
              </label>

              <p className="mt-1 text-sm text-gray-500">
                Leave empty to keep the current thumbnail.
              </p>

              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="mt-4 block w-full text-sm text-gray-700"
              />

              {thumbnailFile && (
                <div className="mt-3 rounded-lg bg-emerald-50 px-4 py-3">
                  <p className="font-bold text-emerald-700">
                    ✓ New thumbnail selected
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-600">
                    {thumbnailFile.name}
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* PUBLISHING OPTIONS */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-xl font-extrabold text-gray-950">
              Publishing Options
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Control how this video appears on Africana.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              {/* FEATURED */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-emerald-300">

                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                />

                <span>
                  <span className="block font-bold text-gray-900">
                    Featured Video
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Show this video in the featured video section.
                  </span>
                </span>

              </label>

              {/* PUBLISH */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-emerald-300">

                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(event.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                />

                <span>
                  <span className="block font-bold text-gray-900">
                    Published
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Make this video visible publicly.
                  </span>
                </span>

              </label>

            </div>
          </section>

          {/* BUTTONS */}
          <div className="mt-6 border-t border-gray-200 pt-6">

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-800 px-6 py-4 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>

              <Link
                href="/admin/videos"
                className="rounded-lg border border-gray-300 bg-white px-6 py-4 text-center font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <a
                href={`/videos/${video.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-emerald-700 px-6 py-4 text-center font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                View Public Video
              </a>

            </div>

          </div>

        </form>
      </div>
    </main>
  );
}