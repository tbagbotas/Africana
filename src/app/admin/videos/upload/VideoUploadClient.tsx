"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

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

export default function VideoUploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("News Reports");
  const [duration, setDuration] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUploading(true);
    setMessage("");
    setError("");

    try {
      if (!videoFile) {
        throw new Error("Please select a video file.");
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("duration", duration.trim());
      formData.append("featured", String(featured));
      formData.append("published", String(published));
      formData.append("video", videoFile);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const response = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to create video."
        );
      }

      setMessage("Video uploaded successfully.");

      setTitle("");
      setDescription("");
      setCategory("News Reports");
      setDuration("");
      setFeatured(false);
      setPublished(true);
      setVideoFile(null);
      setThumbnailFile(null);

      const videoInput = document.getElementById(
        "videoFile"
      ) as HTMLInputElement | null;

      const thumbnailInput = document.getElementById(
        "thumbnailFile"
      ) as HTMLInputElement | null;

      if (videoInput) {
        videoInput.value = "";
      }

      if (thumbnailInput) {
        thumbnailInput.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Africana Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Upload Video
            </h1>

            <p className="mt-2 text-gray-600">
              Add a new video to Africana Video.
            </p>
          </div>

          <Link
            href="/admin/videos"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to Videos
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
        >
          {message && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Video Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                placeholder="Enter video title"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                required
                placeholder="Enter video description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
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
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Duration
                </label>

                <input
                  id="duration"
                  type="text"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="Example: 12:45"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Video
              </h2>

              <div>
                <label
                  htmlFor="videoFile"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Upload Video File
                </label>

                <input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  required
                  onChange={(event) =>
                    setVideoFile(event.target.files?.[0] || null)
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Select the video file you want to publish.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Thumbnail
              </h2>

              <div>
                <label
                  htmlFor="thumbnailFile"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Upload Thumbnail
                </label>

                <input
                  id="thumbnailFile"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setThumbnailFile(event.target.files?.[0] || null)
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Optional. Recommended for the video preview.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Publishing
              </h2>

              <div className="space-y-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(event) => setPublished(event.target.checked)}
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-gray-800">
                    Publish this video
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-gray-800">
                    Feature this video
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
              <Link
                href="/admin/videos"
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={uploading}
                className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}