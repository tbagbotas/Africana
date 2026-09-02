"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Article {
  id: number;
  title: string;
  subtitle: string | null;
  category: string | null;
  author: string | null;
  content: string;
  image: string | null;
  location: string | null;
  readTime: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  status: string;
  publishedAt: Date | null;
  featured: boolean;
  trending: boolean;
  breaking: boolean;
}

interface EditArticleFormProps {
  article: Article;
}

export default function EditArticleForm({
  article,
}: EditArticleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(article.title ?? "");
  const [subtitle, setSubtitle] = useState(article.subtitle ?? "");
  const [category, setCategory] = useState(
    article.category ?? "Africa"
  );
  const [author, setAuthor] = useState(
    article.author ?? "Africana News"
  );
  const [content, setContent] = useState(article.content ?? "");
  const [image, setImage] = useState(article.image ?? "");

  const [location, setLocation] = useState(
    article.location ?? ""
  );

  const [readTime, setReadTime] = useState(
    article.readTime ?? "5 min"
  );

  const [seoTitle, setSeoTitle] = useState(
    article.seoTitle ?? ""
  );

  const [metaDescription, setMetaDescription] = useState(
    article.metaDescription ?? ""
  );

  const [keywords, setKeywords] = useState(
    article.keywords ?? ""
  );

  const normalizeStatus = (value: string) => {
    const status = value.toLowerCase();

    if (status === "published") {
      return "published";
    }

    if (status === "scheduled") {
      return "scheduled";
    }

    return "draft";
  };

  const [status, setStatus] = useState(
    normalizeStatus(article.status)
  );

  const initialDate = article.publishedAt
    ? new Date(article.publishedAt)
    : null;

  const [publishDate, setPublishDate] = useState(
    initialDate
      ? initialDate.toISOString().split("T")[0]
      : ""
  );

  const [publishTime, setPublishTime] = useState(
    initialDate
      ? initialDate.toTimeString().slice(0, 5)
      : ""
  );

  const [featured, setFeatured] = useState(
    article.featured ?? false
  );

  const [trending, setTrending] = useState(
    article.trending ?? false
  );

  const [breaking, setBreaking] = useState(
    article.breaking ?? false
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveArticle() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/articles/update",
        {
          method: "POST",
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
            location,
            readTime,
            seoTitle,
            metaDescription,
            keywords,
            status,
            publishDate,
            publishTime,
            featured,
            trending,
            breaking,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to update article."
        );
      }

      setMessage("Article updated successfully!");

      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/articles/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: article.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to delete article."
        );
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* MESSAGE */}
      {message && (
        <div className="rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* TITLE */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* SUBTITLE */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Subtitle
        </label>

        <input
          type="text"
          value={subtitle}
          onChange={(event) =>
            setSubtitle(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* CATEGORY + AUTHOR */}
      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          >
            <option value="Africa">Africa</option>
            <option value="Business">Business</option>
            <option value="Politics">Politics</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">
              Entertainment
            </option>
            <option value="Climate">Climate</option>
            <option value="World">World</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Author
          </label>

          <input
            type="text"
            value={author}
            onChange={(event) =>
              setAuthor(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

      </div>

      {/* LOCATION */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Location
        </label>

        <input
          type="text"
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
          placeholder="e.g. Lagos, Nigeria"
        />
      </div>

      {/* READ TIME */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Read Time
        </label>

        <select
          value={readTime}
          onChange={(event) =>
            setReadTime(event.target.value)
          }
          className="rounded-lg border border-gray-300 px-4 py-3"
        >
          <option value="3 min">3 min</option>
          <option value="5 min">5 min</option>
          <option value="7 min">7 min</option>
          <option value="10 min">10 min</option>
          <option value="15 min">15 min</option>
        </select>
      </div>

      {/* CONTENT */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Content
        </label>

        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          rows={14}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* SEO */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          SEO Settings
        </h2>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              SEO Title
            </label>

            <input
              type="text"
              value={seoTitle}
              onChange={(event) =>
                setSeoTitle(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Meta Description
            </label>

            <textarea
              value={metaDescription}
              onChange={(event) =>
                setMetaDescription(event.target.value)
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Keywords
            </label>

            <input
              type="text"
              value={keywords}
              onChange={(event) =>
                setKeywords(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Africa, technology, news"
            />
          </div>

        </div>
      </div>

      {/* PUBLISHING */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Publishing
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          {/* DATE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Publish Date
            </label>

            <input
              type="date"
              value={publishDate}
              onChange={(event) =>
                setPublishDate(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {/* TIME */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Publish Time
            </label>

            <input
              type="time"
              value={publishTime}
              onChange={(event) =>
                setPublishTime(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
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

        </div>
      </div>

      {/* ARTICLE OPTIONS */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Article Options
        </h2>

        <div className="space-y-3">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(event.target.checked)
              }
              className="h-5 w-5"
            />

            <span className="font-medium text-gray-700">
              Featured
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={trending}
              onChange={(event) =>
                setTrending(event.target.checked)
              }
              className="h-5 w-5"
            />

            <span className="font-medium text-gray-700">
              Trending
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={breaking}
              onChange={(event) =>
                setBreaking(event.target.checked)
              }
              className="h-5 w-5"
            />

            <span className="font-medium text-gray-700">
              Breaking News
            </span>
          </label>

        </div>
      </div>

      {/* FEATURED IMAGE */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Featured Image
        </h2>

        {image ? (
          <div className="space-y-4">

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title || "Article image"}
              className="max-h-72 w-full rounded-xl object-cover"
            />

            <input
              type="text"
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Image URL"
            />

            <button
              type="button"
              onClick={() => setImage("")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Remove Image
            </button>

          </div>
        ) : (
          <input
            type="text"
            value={image}
            onChange={(event) =>
              setImage(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Featured image URL"
          />
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:justify-between">

        <button
          type="button"
          onClick={deleteArticle}
          disabled={deleting || saving}
          className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting
            ? "Deleting..."
            : "Delete Article"}
        </button>

        <button
          type="button"
          onClick={saveArticle}
          disabled={saving || deleting}
          className="rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

    </div>
  );
}