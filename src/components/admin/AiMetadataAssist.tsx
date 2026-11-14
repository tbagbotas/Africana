"use client";

import { useState } from "react";

interface Draft {
  headline: string;
  metaDescription: string;
  captions: { facebook: string; x: string; linkedin: string };
}

export default function AiMetadataAssist({ content, onApply }: { content: string; onApply: (draft: Draft) => void }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function generate() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/ai/metadata", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Metadata generation failed.");
      setDraft(data as Draft);
    } catch (err) { setError(err instanceof Error ? err.message : "Metadata generation failed."); }
    finally { setLoading(false); }
  }
  return (
    <div className="space-y-2">
      <button type="button" onClick={generate} disabled={loading || content.replace(/<[^>]*>/g, "").trim().length < 80} className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Drafting…" : "AI Assist"}</button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {draft && <div role="dialog" aria-modal="true" aria-labelledby="ai-metadata-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <section className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <h2 id="ai-metadata-title" className="text-xl font-bold">AI metadata drafts</h2>
          <p className="text-sm text-amber-800">Review these suggestions. Nothing is applied or published until you choose Apply.</p>
          <div><h3 className="font-semibold">Headline ({draft.headline.length}/60)</h3><p className="mt-1 rounded-lg bg-gray-50 p-3">{draft.headline}</p></div>
          <div><h3 className="font-semibold">Meta description ({draft.metaDescription.length}/155)</h3><p className="mt-1 rounded-lg bg-gray-50 p-3">{draft.metaDescription}</p></div>
          {([ ["Facebook", draft.captions.facebook], ["X", draft.captions.x], ["LinkedIn", draft.captions.linkedin] ] as const).map(([platform, caption]) => <div key={platform}><h3 className="font-semibold">{platform} caption</h3><p className="mt-1 rounded-lg bg-gray-50 p-3">{caption}</p></div>)}
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setDraft(null)} className="rounded-lg border px-4 py-2 font-semibold">Dismiss</button><button type="button" onClick={() => { onApply(draft); setDraft(null); }} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800">Apply headline and meta description</button></div>
        </section>
      </div>}
    </div>
  );
}
