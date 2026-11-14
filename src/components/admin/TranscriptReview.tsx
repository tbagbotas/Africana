"use client";

import { useState } from "react";

export default function TranscriptReview({ id, type, mediaUrl, initialTranscript, initialApproved = false }: {
  id: number; type: "video" | "podcast"; mediaUrl: string; initialTranscript?: string | null; initialApproved?: boolean;
}) {
  const [transcript, setTranscript] = useState(initialTranscript || "");
  const [approved, setApproved] = useState(initialApproved);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/ai/transcribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, type, mediaUrl }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Transcription failed.");
      setTranscript(data.transcriptVtt); setApproved(false); setMessage("Transcript draft generated. Review it before approval.");
    } catch (err) { setError(err instanceof Error ? err.message : "Transcription failed."); }
    finally { setBusy(false); }
  }

  async function save(approve: boolean) {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/ai/transcribe", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, type, transcriptVtt: transcript, approved: approve }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save transcript.");
      setTranscript(data.transcriptVtt); setApproved(data.approved); setMessage(approve ? "Transcript approved for publishing." : "Transcript draft saved.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save transcript."); }
    finally { setBusy(false); }
  }

  return <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">AI transcript review</h2><p className="text-sm text-gray-600">Generated captions remain unpublished until a human editor approves them.</p></div><button type="button" disabled={busy} onClick={generate} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? "Working…" : transcript ? "Regenerate transcript" : "Generate Transcript"}</button></div>
    {transcript && <><label htmlFor={`transcript-${type}-${id}`} className="mt-4 block text-sm font-semibold">Editable WebVTT transcript</label><textarea id={`transcript-${type}-${id}`} value={transcript} onChange={(e) => { setTranscript(e.target.value); setApproved(false); }} rows={12} className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-mono text-sm"/><p className={`mt-2 text-sm font-semibold ${approved ? "text-emerald-700" : "text-amber-700"}`}>{approved ? "Approved for publishing" : "Draft — needs human review"}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => save(false)} className="rounded-lg border px-4 py-2 font-semibold">Save draft</button><button type="button" disabled={busy} onClick={() => save(true)} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50">Approve for publishing</button></div></>}
    {message && <p role="status" className="mt-3 text-sm text-emerald-800">{message}</p>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
  </section>;
}
