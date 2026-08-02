"use client";

type PublishSidebarProps = {
  category: string;
  setCategory: (value: string) => void;

  author: string;
  setAuthor: (value: string) => void;

  tags: string;
  setTags: (value: string) => void;

  featured: boolean;
  setFeatured: (value: boolean) => void;

  trending: boolean;
  setTrending: (value: boolean) => void;

  breaking: boolean;
  setBreaking: (value: boolean) => void;
};

export default function PublishSidebar({
  category,
  setCategory,
  author,
  setAuthor,
  tags,
  setTags,
  featured,
  setFeatured,
  trending,
  setTrending,
  breaking,
  setBreaking,
}: PublishSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Article Details
        </h2>

        <label className="mb-2 block font-medium">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 w-full rounded-lg border p-3"
        >
          <option value="">Select Category</option>
          <option value="Africa">Africa</option>
          <option value="Business">Business</option>
          <option value="Politics">Politics</option>
          <option value="Technology">Technology</option>
          <option value="Sports">Sports</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Climate">Climate</option>
          <option value="World">World</option>
        </select>

        <label className="mb-2 block font-medium">
          Author
        </label>

        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Africana News"
          className="mb-4 w-full rounded-lg border p-3"
        />

        <label className="mb-2 block font-medium">
          Tags
        </label>

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Politics, Economy, Africa"
          className="mb-4 w-full rounded-lg border p-3"
        />

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trending}
              onChange={(e) => setTrending(e.target.checked)}
            />
            Trending
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={breaking}
              onChange={(e) => setBreaking(e.target.checked)}
            />
            Breaking News
          </label>
        </div>
      </div>
    </aside>
  );
}