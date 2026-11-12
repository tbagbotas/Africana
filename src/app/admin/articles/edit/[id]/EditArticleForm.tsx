
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Correspondent {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  category: string | null;
  correspondentId: number | null;
  tags: string | null;
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
  const [slug, setSlug] = useState(article.slug ?? "");
  const [subtitle, setSubtitle] = useState(article.subtitle ?? "");
  const [category, setCategory] = useState(article.category ?? "Africa");

  const [correspondentId, setCorrespondentId] = useState(
    article.correspondentId != null
      ? String(article.correspondentId)
      : ""
  );

  const [correspondents, setCorrespondents] = useState<Correspondent[]>([]);
  const [tags, setTags] = useState(article.tags ?? "");
  const [author, setAuthor] = useState(article.author ?? "Africana News");
  const [content, setContent] = useState(article.content ?? "");
  const [image, setImage] = useState(article.image ?? "");
  const [location, setLocation] = useState(article.location ?? "");
  const [readTime, setReadTime] = useState(article.readTime ?? "5 min");
  const [seoTitle, setSeoTitle] = useState(article.seoTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    article.metaDescription ?? ""
  );
  const [keywords, setKeywords] = useState(article.keywords ?? "");

  const normalizeStatus = (value: string) => {
    const normalizedStatus = value.toLowerCase();

    if (normalizedStatus === "published") return "published";
    if (normalizedStatus === "scheduled") return "scheduled";

    return "draft";
  };

  const [status, setStatus] = useState(normalizeStatus(article.status));

  const initialDate = article.publishedAt
    ? new Date(article.publishedAt)
    : null;

  const [publishDate, setPublishDate] = useState(
    initialDate && !Number.isNaN(initialDate.getTime())
      ? `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(2, "0")}-${String(initialDate.getDate()).padStart(2, "0")}`
      : ""
  );
  const [publishTime, setPublishTime] = useState(
    initialDate && !Number.isNaN(initialDate.getTime())
      ? initialDate.toTimeString().slice(0, 5)
      : ""
  );

  const [featured, setFeatured] = useState(article.featured ?? false);
  const [trending, setTrending] = useState(article.trending ?? false);
  const [breaking, setBreaking] = useState(article.breaking ?? false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadCorrespondents() {
      try {
        const response = await fetch("/api/correspondents");

        if (!response.ok) {
          throw new Error("Failed to load correspondents.");
        }

        const data = await response.json();

        setCorrespondents(
          Array.isArray(data.correspondents)
            ? data.correspondents
            : []
        );
      } catch (error) {
        console.error("Failed to load correspondents:", error);
      }
    }

    loadCorrespondents();
  }, []);

  async function handleSave() {
    setSaving(true);

    try {
      const response = await fetch("/api/articles/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: article.id,
          title,
          slug,
          subtitle,
          category,
          correspondentId,
          tags,
          author,
          image,
          content,
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
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            data.message ||
            "Failed to update article."
        );
        return;
      }

      alert("Article updated successfully!");
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the article.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch("/api/articles/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: article.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete article.");
        return;
      }

      alert("Article deleted successfully!");
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the article.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Article
          </h1>
        </div>

        <div className="space-y-6">
          {/* TITLE */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Article title"
            />
          </section>

          {/* SLUG */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="article-url-slug"
            />
          </section>

          {/* SUBTITLE */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Article subtitle"
            />
          </section>

          {/* CATEGORY */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="Africa">Africa</option>
              <option value="Business">Business</option>
              <option value="Politics">Politics</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Climate">Climate</option>
              <option value="World">World</option>
            </select>
          </section>

          {/* CORRESPONDENT */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Correspondent
            </label>
            <select
              value={correspondentId}
              onChange={(event) => setCorrespondentId(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">Select Correspondent</option>
              {correspondents.map((correspondent) => (
                <option
                  key={correspondent.id}
                  value={correspondent.id}
                >
                  {correspondent.name}
                </option>
              ))}
            </select>
          </section>

          {/* AUTHOR */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Author"
            />
          </section>

          {/* TAGS */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Africa, politics, Nigeria"
            />
          </section>

          {/* LOCATION */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Location"
            />
          </section>

          {/* READ TIME */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Read Time
            </label>
            <select
              value={readTime}
              onChange={(event) => setReadTime(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="3 min">3 min</option>
              <option value="5 min">5 min</option>
              <option value="7 min">7 min</option>
              <option value="10 min">10 min</option>
              <option value="15 min">15 min</option>
            </select>
          </section>

          {/* CONTENT */}
          <section className="rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Content
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </section>

          {/* IMAGE */}
          <ImageUpload image={image} setImage={setImage} />

          {/* SEO */}
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold">SEO Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(event) => setSeoTitle(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="SEO title"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  rows={4}
                  placeholder="Meta description"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(event) => setKeywords(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="Africa, technology, news"
                />
              </div>
            </div>
          </section>

          {/* PUBLISHING */}
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold">Publishing</h2>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(event) => setPublishDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Publish Time
                </label>
                <input
                  type="time"
                  value={publishTime}
                  onChange={(event) => setPublishTime(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </section>

          {/* ARTICLE OPTIONS */}
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold">Article Options</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                />
                <span>Featured</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(event) => setTrending(event.target.checked)}
                />
                <span>Trending</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={breaking}
                  onChange={(event) => setBreaking(event.target.checked)}
                />
                <span>Breaking News</span>
              </label>
            </div>
          </section>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}

              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Article"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
              className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
