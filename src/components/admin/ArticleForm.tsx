"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import PublishSidebar from "./PublishSidebar";
import ImageUpload from "./ImageUpload";
import ArticlePreview from "../admin/ArticlePreview";
import MediaLibrary from "./MediaLibrary";
import SeoPanel from "./editor/SeoPanel";
import { useDraft } from "./useDraft";

export default function ArticleForm() {
  const [articleId, setArticleId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const [image, setImage] = useState("");
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([]);

  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState("Africana News");
  const [location, setLocation] = useState("");
  const [readTime, setReadTime] = useState("5 min");
  const [tags, setTags] = useState("");

  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [status, setStatus] = useState("draft");

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

  useEffect(() => {
    try {
      const savedMedia = localStorage.getItem("media-library");

      if (!savedMedia) {
        return;
      }

      const parsedMedia = JSON.parse(savedMedia);

      if (Array.isArray(parsedMedia)) {
       setTimeout(() => {
  setMediaLibrary(parsedMedia);
}, 0);
      }
    } catch (error) {
      console.error("Failed to load media library:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "media-library",
        JSON.stringify(mediaLibrary)
      );
    } catch (error) {
      console.error("Failed to save media library:", error);
    }
  }, [mediaLibrary]);

  function handleImageChange(newImage: string) {
    setImage(newImage);

    setMediaLibrary((current) => {
      if (!newImage || current.includes(newImage)) {
        return current;
      }

      return [newImage, ...current];
    });
  }

  function clearDraftStorage() {
    const draftKeys = [
      "draft-title",
      "draft-subtitle",
      "draft-slug",
      "draft-content",
      "draft-seo-title",
      "draft-meta-description",
      "draft-keywords",
      "draft-category",
      "draft-author",
      "draft-tags",
      "draft-image",
      "draft-featured",
      "draft-trending",
      "draft-breaking",
    ];

    draftKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  async function publishArticle() {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    if (!content.trim()) {
      alert("Please write the article content.");
      return;
    }

    if (
      status === "scheduled" &&
      (!publishDate || !publishTime)
    ) {
      alert(
        "Please select a publish date and publish time for scheduled articles."
      );
      return;
    }

    try {
      setPublishing(true);
console.log("IMAGE BEING SENT:", image);
      const response = await fetch("/api/articles/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: articleId,
          title,
          subtitle,
          slug,
          content,
          image,
          category,
          author,
          location,
          readTime,
          tags,
          seoTitle,
          metaDescription,
          keywords,
          publishDate,
          publishTime,
          status,
          featured,
          trending,
          breaking,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            data.error ||
            "Publishing failed."
        );
      }

      if (data.article?.id) {
        setArticleId(Number(data.article.id));
      }

      if (status === "scheduled") {
        alert("✅ Article scheduled successfully!");
      } else if (status === "draft") {
        alert("✅ Article saved as draft!");
      } else {
        alert("✅ Article published successfully!");
      }

      if (image) {
        setMediaLibrary((current) => {
          if (current.includes(image)) {
            return current;
          }

          return [image, ...current];
        });
      }

      setTitle("");
      setSubtitle("");
      setSlug("");
      setContent("");
      setImage("");

      setCategory("General");
      setAuthor("Africana News");
      setLocation("");
      setReadTime("5 min");
      setTags("");

      setSeoTitle("");
      setMetaDescription("");
      setKeywords("");

      setFeatured(false);
      setTrending(false);
      setBreaking(false);

      setPublishDate("");
      setPublishTime("");
      setStatus("draft");

      setArticleId(null);

      clearDraftStorage();
    } catch (error) {
      console.error("Article publishing error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to save article.";

      alert(`❌ ${message}`);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">

        {/* MAIN EDITOR */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-white p-5 shadow sm:p-6">

            <h1 className="mb-6 text-3xl font-bold">
              Create New Article
            </h1>

            <div className="space-y-5">

              {/* TITLE */}
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
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-2 block font-semibold">
                  Slug
                </label>

                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-url-slug"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* SUBTITLE */}
              <div>
                <label className="mb-2 block font-semibold">
                  Subtitle
                </label>

                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Subtitle..."
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* EDITOR */}
              <RichTextEditor
                content={content}
                onChange={setContent}
              />

              {/* ARTICLE DETAILS */}
              <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 sm:p-6">

                <h2 className="mb-5 text-xl font-bold text-emerald-800">
                  Article Details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* LOCATION */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Location
                    </label>

                    <input
                      type="text"
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value)
                      }
                      placeholder="e.g. Nigeria"
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* READ TIME */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Read Time
                    </label>

                    <select
                      value={readTime}
                      onChange={(e) =>
                        setReadTime(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-emerald-600"
                    >
                      <option value="3 min">3 min</option>
                      <option value="5 min">5 min</option>
                      <option value="7 min">7 min</option>
                      <option value="10 min">10 min</option>
                      <option value="15 min">15 min</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* IMAGE */}
              <ImageUpload
                image={image}
                setImage={handleImageChange}
              />

              {/* MEDIA LIBRARY */}
              <MediaLibrary
                images={mediaLibrary}
                onSelect={(selectedImage) => {
                  setImage(selectedImage);
                }}
              />

              {/* SCHEDULE */}
              <div className="rounded-xl bg-white p-5 shadow sm:p-6">

                <h2 className="mb-4 text-lg font-bold">
                  Schedule Article
                </h2>

                <div className="space-y-4">

                  {/* DATE */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Publish Date
                    </label>

                    <input
                      type="date"
                      value={publishDate}
                      onChange={(e) =>
                        setPublishDate(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* TIME */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Publish Time
                    </label>

                    <input
                      type="time"
                      value={publishTime}
                      onChange={(e) =>
                        setPublishTime(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* STATUS */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
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

              {/* LIVE PREVIEW */}
              <ArticlePreview
                title={title}
                subtitle={subtitle}
                content={content}
                image={image}
              />

            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
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

          {/* PUBLISH BUTTON */}
          <div className="rounded-xl bg-white p-6 shadow">

            <button
              type="button"
              onClick={publishArticle}
              disabled={publishing}
              className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {publishing
                ? "Saving..."
                : status === "draft"
                  ? "Save Draft"
                  : status === "scheduled"
                    ? "Schedule Article"
                    : "Publish Article"}
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}