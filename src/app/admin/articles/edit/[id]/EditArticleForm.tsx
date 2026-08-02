"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  article: {
    id: number;
    title: string;
    subtitle: string | null;
    category: string | null;
    author: string | null;
    content: string;
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

  async function saveArticle() {
    setSaving(true);

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
      }),
    });

    setSaving(false);

    if (response.ok) {
      alert("Article updated successfully!");
      router.push("/admin/articles");
      router.refresh();
    } else {
      const error = await response.text();
      alert(error);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 font-semibold">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          Subtitle
        </label>

        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          Category
        </label>

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          Author
        </label>

        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          Content
        </label>

        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border p-3"
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