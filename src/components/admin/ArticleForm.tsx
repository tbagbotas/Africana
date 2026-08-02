"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import PublishSidebar from "./PublishSidebar";
import ImageUpload from "./ImageUpload";

export default function ArticleForm() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");

  const [image, setImage] = useState("");

  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState("Africana News");
  const [tags, setTags] = useState("");

  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const [publishing, setPublishing] = useState(false);

  async function publishArticle() {
    try {
      setPublishing(true);

      const response = await fetch("/api/articles/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          subtitle,
          content,
          image,
          category,
          author,
          tags,
          featured,
          trending,
          breaking,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Publishing failed.");
      }

      alert("✅ Article published successfully!");

      setTitle("");
      setSubtitle("");
      setContent("");
      setImage("");
      setCategory("General");
      setAuthor("Africana News");
      setTags("");
      setFeatured(false);
      setTrending(false);
      setBreaking(false);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to publish article.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h1 className="mb-6 text-3xl font-bold">
              Create New Article
            </h1>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-semibold">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title..."
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Subtitle
                </label>

                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Subtitle..."
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
                />
              </div>

              <RichTextEditor
                value={content}
                onChange={setContent}
              />

              <ImageUpload
                image={image}
                setImage={setImage}
              />            </div>
          </div>
        </div>

        <div className="space-y-6">
          <PublishSidebar
            category={category}
            setCategory={setCategory}
            author={author}
            setAuthor={setAuthor}
            tags={tags}
            setTags={setTags}
            featured={featured}
            setFeatured={setFeatured}
            trending={trending}
            setTrending={setTrending}
            breaking={breaking}
            setBreaking={setBreaking}
          />

          <div className="rounded-xl bg-white p-6 shadow">
            <button
              type="button"
              onClick={publishArticle}
              disabled={publishing}
              className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {publishing ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}