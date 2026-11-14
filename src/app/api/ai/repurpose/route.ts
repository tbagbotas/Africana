import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin-api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI assistance is not configured." }, { status: 503 });
  try {
    const body = await request.json();
    const id = Number(body.articleId);
    if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: "Save the article before generating a newsletter draft." }, { status: 400 });
    const article = await prisma.article.findUnique({ where: { id }, select: { title: true, content: true } });
    if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 });
    const text = article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length < 80 || text.length > 30000) return NextResponse.json({ error: "Article body must contain between 80 and 30,000 characters." }, { status: 400 });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.3, messages: [
        { role: "system", content: "Write a factual newsletter summary of exactly 100 words using only the supplied article. Return only the summary text. Do not invent or infer facts." },
        { role: "user", content: `Headline: ${article.title}\n\n${text}` },
      ] }), signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("AI repurpose provider error:", response.status, result?.error?.type || "unknown");
      return NextResponse.json({ error: "Could not generate a newsletter draft." }, { status: 502 });
    }
    const generated = result?.choices?.[0]?.message?.content;
    if (typeof generated !== "string" || !generated.trim()) throw new Error("Empty newsletter draft");
    const newsletterDraft = generated.trim().split(/\s+/).slice(0, 100).join(" ");
    await prisma.article.update({ where: { id }, data: { newsletterDraft } });
    return NextResponse.json({ newsletterDraft, status: "draft" });
  } catch (error) {
    console.error("AI newsletter draft failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not generate a newsletter draft." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const id = Number(body.articleId);
    const newsletterDraft = typeof body.newsletterDraft === "string" ? body.newsletterDraft.trim() : "";
    if (!Number.isSafeInteger(id) || id < 1 || !newsletterDraft || newsletterDraft.length > 2000) return NextResponse.json({ error: "A valid newsletter draft is required." }, { status: 400 });
    const article = await prisma.article.update({ where: { id }, data: { newsletterDraft }, select: { newsletterDraft: true } });
    return NextResponse.json({ newsletterDraft: article.newsletterDraft, status: "draft" });
  } catch (error) {
    console.error("Saving newsletter draft failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not save the newsletter draft." }, { status: 500 });
  }
}
