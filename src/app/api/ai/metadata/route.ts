import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI assistance is not configured. Add OPENAI_API_KEY to the server environment." }, { status: 503 });

  let body: { content?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 }); }
  const content = typeof body.content === "string" ? body.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
  if (content.length < 80 || content.length > 30000) return NextResponse.json({ error: "Article body must contain between 80 and 30,000 characters." }, { status: 400 });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.3, messages: [
        { role: "system", content: 'Draft accurate, neutral editorial metadata from the article. Return JSON with keys headline, metaDescription, captions (object with facebook, x, linkedin). Limit headline to 60 characters and metaDescription to 155 characters. Do not add facts.' },
        { role: "user", content },
      ] }),
      signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("AI metadata provider error:", response.status, result?.error?.type || "unknown");
      return NextResponse.json({ error: "Could not generate metadata. Please try again." }, { status: 502 });
    }
    const raw = result?.choices?.[0]?.message?.content;
    const draft = typeof raw === "string" ? JSON.parse(raw) : null;
    if (!draft || typeof draft.headline !== "string" || typeof draft.metaDescription !== "string" || !draft.captions) throw new Error("Invalid metadata response");
    const output = {
      headline: draft.headline.trim().slice(0, 60),
      metaDescription: draft.metaDescription.trim().slice(0, 155),
      captions: { facebook: String(draft.captions.facebook || "").trim(), x: String(draft.captions.x || "").trim(), linkedin: String(draft.captions.linkedin || "").trim() },
    };
    if (!output.headline || !output.metaDescription || Object.values(output.captions).some((caption) => !caption)) throw new Error("Incomplete metadata response");
    return NextResponse.json(output);
  } catch (error) {
    console.error("AI metadata generation failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not generate metadata. Please try again." }, { status: 502 });
  }
}
