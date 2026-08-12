"use client";

import Image from "next/image";

interface ArticlePreviewProps {
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

export default function ArticlePreview({
  title,
  subtitle,
  content,
  image,
}: ArticlePreviewProps) {
  return (
    <div className="rounded-xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        👁️ Live Preview
      </h2>

      {image && (
        <div className="relative mb-8 h-72 w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title || "Article image"}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <h1 className="mb-3 text-4xl font-bold">
        {title || "Article Title"}
      </h1>

      <p className="mb-8 text-xl text-gray-600">
        {subtitle || "Article Subtitle"}
      </p>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html:
            content ||
            "<p>Start writing your article...</p>",
        }}
      />
    </div>
  );
}