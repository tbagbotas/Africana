"use client";

import { useState } from "react";

export default function NewsletterDraftAssist({ articleId, initialDraft = "", disabled = false }: { articleId: number | null; initialDraft?: string | null; disabled?: boolean }) {
  const [draft, setDraft] = useState(initialDraft || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function generate() {
    if (!articleId) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/ai/repurpose", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ articleId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Newsletter draft generation failed.");
      setDraft(data.newsletterDraft); setMessage("Saved as an unpublished draft attached to this article.");
    } catch (err) { setError(err instanceof Error ? err.message : "Newsletter draft generation failed."); }
    finally { setBusy(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setMessage("Draft copied to clipboard."); }
    catch { setError("Could not copy automatically. Select and copy the draft text."); }
  }
  async function saveDraft() {
    if (!articleId) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/ai/repurpose", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ articleId, newsletterDraft: draft }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save draft.");
      setDraft(data.newsletterDraft); setMessage("Newsletter draft saved to the article.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save draft."); }
    finally { setBusy(false); }
  }

  return <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">Newsletter draft</h2><p className="text-sm text-gray-600">Creates an unpublished 100-word draft; it is never sent or published automatically.</p></div><button type="button" disabled={disabled || !articleId || busy} onClick={generate} className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50">{busy ? "Drafting…" : "Generate Newsletter Draft"}</button></div>
    {disabled && <p className="mt-2 text-sm text-gray-600">Save the article first to attach a newsletter draft.</p>}
    {draft && <><label className="mt-4 block text-sm font-semibold" htmlFor={`newsletter-draft-${articleId}`}>Review and copy draft</label><textarea id={`newsletter-draft-${articleId}`} value={draft} onChange={(event) => setDraft(event.target.value)} rows={6} className="mt-2 w-full rounded-lg border border-gray-300 p-3"/><div className="mt-3 flex gap-3"><button type="button" disabled={busy} onClick={saveDraft} className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Save draft</button><button type="button" onClick={copy} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800">Copy draft</button></div></>}
    {message && <p role="status" className="mt-2 text-sm text-emerald-800">{message}</p>}{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </section>;
}
