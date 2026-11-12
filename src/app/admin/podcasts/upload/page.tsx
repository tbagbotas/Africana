"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const categories = [
  "News Analysis",
  "Interviews",
  "Africa Focus",
  "Ideas & Conversations",
];

export default function UploadPodcastPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/podcasts", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Podcast upload failed.");
      }

      setMessage("Podcast uploaded successfully.");

      form.reset();

      setAudioFile(null);
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Podcast upload failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/podcasts"
            className="font-semibold text-emerald-700 hover:text-emerald-900"
          >
            ← Back to Podcasts
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-emerald-700">
            AFRICANA AUDIO
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">
            Upload Podcast
          </h1>

          <p className="mt-3 text-gray-600">
            Upload a new podcast episode with audio, video, thumbnail,
            description, and publishing settings.
          </p>
        </div>

        {/* MESSAGES */}
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

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* PODCAST INFORMATION */}
          <section>
            <h2 className="text-xl font-extrabold text-gray-950">
              Podcast Information
            </h2>

            {/* TITLE */}
            <div className="mt-6">
              <label
                htmlFor="title"
                className="block text-sm font-bold text-gray-800"
              >
                Podcast Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Africana Daily News Briefing"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <label
                htmlFor="description"
                className="block text-sm font-bold text-gray-800"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Write a description for this podcast episode..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* CATEGORY + DURATION */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-gray-800"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="" disabled>
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-bold text-gray-800"
                >
                  Duration
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="text"
                  placeholder="e.g. 10:30"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-1 text-sm text-gray-500">
                  Example: 10:30 or 1:05:20
                </p>
              </div>
            </div>
          </section>

          {/* MEDIA FILES */}
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-gray-950">
              Media Files
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload an audio file, video file, or both. At least one is required.
            </p>

            {/* AUDIO */}
            <div className="mt-6">
              <label
                htmlFor="audio"
                className="block text-sm font-bold text-gray-800"
              >
                Audio File
              </label>

              <div
                className={`mt-2 rounded-xl border-2 p-4 transition ${
                  audioFile
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-black bg-white"
                }`}
              >
                <input
                  id="audio"
                  name="audio"
                  type="file"
                  accept="audio/*"
                  onChange={(event) =>
                    setAudioFile(event.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-gray-700"
                />

                {audioFile ? (
                  <p className="mt-3 font-semibold text-emerald-700">
                    ✅ File selected: {audioFile.name}
                  </p>
                ) : (
                  <p className="mt-3 font-semibold text-black">
                    No file selected
                  </p>
                )}

                <p className="mt-1 text-sm text-gray-500">
                  Upload the podcast audio.
                </p>
              </div>
            </div>

            {/* VIDEO */}
            <div className="mt-6">
              <label
                htmlFor="video"
                className="block text-sm font-bold text-gray-800"
              >
                Video File
              </label>

              <div
                className={`mt-2 rounded-xl border-2 p-4 transition ${
                  videoFile
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-black bg-white"
                }`}
              >
                <input
                  id="video"
                  name="video"
                  type="file"
                  accept="video/*"
                  onChange={(event) =>
                    setVideoFile(event.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-gray-700"
                />

                {videoFile ? (
                  <p className="mt-3 font-semibold text-emerald-700">
                    ✅ File selected: {videoFile.name}
                  </p>
                ) : (
                  <p className="mt-3 font-semibold text-black">
                    No file selected
                  </p>
                )}

                <p className="mt-1 text-sm text-gray-500">
                  Optional video version of the podcast.
                </p>
              </div>
            </div>

            {/* THUMBNAIL */}
            <div className="mt-6">
              <label
                htmlFor="thumbnail"
                className="block text-sm font-bold text-gray-800"
              >
                Thumbnail
              </label>

              <div
                className={`mt-2 rounded-xl border-2 p-4 transition ${
                  thumbnailFile
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-black bg-white"
                }`}
              >
                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setThumbnailFile(event.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-gray-700"
                />

                {thumbnailFile ? (
                  <p className="mt-3 font-semibold text-emerald-700">
                    ✅ File selected: {thumbnailFile.name}
                  </p>
                ) : (
                  <p className="mt-3 font-semibold text-black">
                    No file selected
                  </p>
                )}

                <p className="mt-1 text-sm text-gray-500">
                  Upload the cover image for this podcast.
                </p>
              </div>
            </div>
          </section>

          {/* OPTIONS */}
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-gray-950">
              Publishing Options
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              {/* FEATURED */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-emerald-300">
                <input
                  type="checkbox"
                  name="featured"
                  value="true"
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                />

                <span>
                  <span className="block font-bold text-gray-900">
                    Featured Podcast
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Show this episode in the featured podcast section.
                  </span>
                </span>
              </label>

              {/* PUBLISHED */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-emerald-300">
                <input
                  type="checkbox"
                  name="published"
                  value="true"
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                />

                <span>
                  <span className="block font-bold text-gray-900">
                    Publish Now
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Make this podcast visible publicly immediately.
                  </span>
                </span>
              </label>

            </div>
          </section>

          {/* SUBMIT */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-800 px-6 py-4 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Uploading Podcast..."
                  : "Upload Podcast"}
              </button>

              <Link
                href="/admin/podcasts"
                className="rounded-lg border border-gray-300 bg-white px-6 py-4 text-center font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

            </div>
          </div>
        </form>
      </div>
    </main>
  );
}