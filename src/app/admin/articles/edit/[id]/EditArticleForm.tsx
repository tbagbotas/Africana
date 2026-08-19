"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

interface Props {
  article: {
    id: number;
    title: string;
    subtitle: string | null;
    category: string | null;
    author: string | null;
    content: string;
    image: string | null;
    status: string;
    publishedAt: Date;
    featured: boolean;
    trending: boolean;
    breaking: boolean;
  };
}

export default function EditArticleForm({ article }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(article.title);
  const [subtitle, setSubtitle] = useState(article.subtitle ?? "");
  const [category, setCategory] = useState(article.category ?? "");
  const [author, setAuthor] = useState(article.author ?? "");
  const [content, setContent] = useState(article.content);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(article.image ?? "");

  const [status, setStatus] = useState(article.status);

  const [publishDate, setPublishDate] = useState(() => {
    const date = new Date(article.publishedAt);
    return date.toISOString().slice(0, 10);
  });

  const [publishTime, setPublishTime] = useState(() => {
    const date = new Date(article.publishedAt);
    return date.toISOString().slice(11, 16);
  });

  const [featured, setFeatured] = useState(article.featured);
  const [trending, setTrending] = useState(article.trending);
  const [breaking, setBreaking] = useState(article.breaking);

  async function saveArticle() {
    setSaving(true);

    try {
      const response = await fetch("/api/articles/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: article.id,
          title,
          subtitle,
          category,
          author,
          content,
          image,
          status,
          publishDate,
          publishTime,
          featured,
          trending,
          breaking,
        }),
      });

      if (response.ok) {
        alert("Article updated successfully!");
        router.push("/admin/articles");
        router.refresh();
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update article.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block font-semibold">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Subtitle
        </label>

        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Category
        </label>

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Author
        </label>

        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Content
        </label>

        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option value="draft">
            Draft
          </option>

          <option value="scheduled">
            Scheduled
          </option>

          <option value="published">
            Published
          </option>
        </select>
      </div>

      {status === "scheduled" && (
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="font-semibold">
            Schedule Article
          </h2>

          <div>
            <label className="mb-2 block font-semibold">
              Publish Date
            </label>

            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Publish Time
            </label>

            <input
              type="time"
              value={publishTime}
              onChange={(e) => setPublishTime(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">
          Article Options
        </h2>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-5 w-5"
          />

          <span>
            Featured
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={trending}
            onChange={(e) => setTrending(e.target.checked)}
            className="h-5 w-5"
          />

          <span>
            Trending
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={breaking}
            onChange={(e) => setBreaking(e.target.checked)}
            className="h-5 w-5"
          />

          <span>
            Breaking News
          </span>
        </label>
      </div>

      <div>
        <ImageUpload
          image={image}
          setImage={setImage}
        />
      </div>

      <button
        type="button"
        onClick={saveArticle}
        disabled={saving}
        className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}