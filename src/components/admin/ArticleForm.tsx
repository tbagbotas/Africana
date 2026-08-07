"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import PublishSidebar from "./PublishSidebar";
import ImageUpload from "./ImageUpload";
import ArticlePreview from "../admin/ArticlePreview";
import MediaLibrary from "./MediaLibrary";
import SeoPanel from "./editor/SeoPanel";
import { useDraft } from "./useDraft";
export default function ArticleForm() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const [image, setImage] = useState("");
const [mediaLibrary, setMediaLibrary] = useState<string[]>([]);
  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState("Africana News");
  const [tags, setTags] = useState("");

  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const [publishing, setPublishing] = useState(false);
useDraft("draft-title", title, setTitle);
useDraft("draft-subtitle", subtitle, setSubtitle);
useDraft("draft-slug", slug, setSlug);
useDraft("draft-content", content, setContent);
useDraft("draft-seo-title", seoTitle, setSeoTitle);
useDraft("draft-meta-description", metaDescription, setMetaDescription);
useDraft("draft-keywords", keywords, setKeywords);
useDraft("draft-category", category, setCategory);
useDraft("draft-author", author, setAuthor);
useDraft("draft-tags", tags, setTags);
useDraft("draft-image", image, setImage);
useDraft("draft-featured", featured, setFeatured);
useDraft("draft-trending", trending, setTrending);
useDraft("draft-breaking", breaking, setBreaking);
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

          seoTitle,
          metaDescription,
          keywords,

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
setMediaLibrary((current) => {
  if (!image || current.includes(image)) {
    return current;
  }

  return [...current, image];
});
      setCategory("General");
      setAuthor("Africana News");
      setTags("");

      setSeoTitle("");
      setMetaDescription("");
      setKeywords("");

      setFeatured(false);
      setTrending(false);
      setBreaking(false);
      localStorage.removeItem("draft-title");
localStorage.removeItem("draft-subtitle");
localStorage.removeItem("draft-slug");
localStorage.removeItem("draft-content");
localStorage.removeItem("draft-seo-title");
localStorage.removeItem("draft-meta-description");
localStorage.removeItem("draft-keywords");
localStorage.removeItem("draft-category");
localStorage.removeItem("draft-author");
localStorage.removeItem("draft-tags");
localStorage.removeItem("draft-image");
localStorage.removeItem("draft-featured");
localStorage.removeItem("draft-trending");
localStorage.removeItem("draft-breaking");
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
 onChange={(e) => {
  const value = e.target.value;

  setTitle(value);

  setSlug(
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  );
}}
  placeholder="Article title..."
  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
/>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  <div>
  <label className="mb-2 block font-semibold">
    Slug
  </label>

  <input
    type="text"
    value={slug}
    onChange={(e) => setSlug(e.target.value)}
    placeholder="article-url-slug"
    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
  />
</div>
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
                content={content}
                onChange={setContent}
              />

              <ImageUpload
                image={image}
                setImage={setImage}
              />  
               <MediaLibrary
  images={mediaLibrary}
  onSelect={(selectedImage) => {
    setImage(selectedImage);
  }}
/>
                       <ArticlePreview
                title={title}
                subtitle={subtitle}
                content={content}
                image={image}
              />
            </div>
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

          <SeoPanel
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            keywords={keywords}
            setKeywords={setKeywords}
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