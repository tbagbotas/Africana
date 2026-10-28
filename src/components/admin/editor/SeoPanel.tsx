"use client";

interface SeoPanelProps {
  seoTitle: string;
  setSeoTitle: (value: string) => void;

  metaDescription: string;
  setMetaDescription: (value: string) => void;

  keywords: string;
  setKeywords: (value: string) => void;
}

export default function SeoPanel({
  seoTitle,
  setSeoTitle,
  metaDescription,
  setMetaDescription,
  keywords,
  setKeywords,
}: SeoPanelProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold">
        🔍 SEO Settings
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block font-semibold">
            SEO Title
          </label>

          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO title..."
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Meta Description
          </label>

          <textarea
            rows={4}
            value={metaDescription}
            onChange={(e) =>
              setMetaDescription(e.target.value)
            }
            placeholder="Write a short description..."
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Keywords
          </label>

          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Africa, Politics, Economy..."
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
          />
        </div>
      </div>
    </div>
  );
}