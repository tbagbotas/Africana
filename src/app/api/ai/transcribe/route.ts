import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin-api";

export const runtime = "nodejs";
export const maxDuration = 60;
const MAX_MEDIA_BYTES = 24 * 1024 * 1024;

type MediaType = "video" | "podcast";

function validMediaUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch { return false; }
}

export async function POST(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI transcription is not configured." }, { status: 503 });
  try {
    const body = await request.json();
    const id = Number(body.id);
    const type = body.type as MediaType;
    if (!Number.isSafeInteger(id) || id < 1 || !["video", "podcast"].includes(type) || !validMediaUrl(body.mediaUrl)) {
      return NextResponse.json({ error: "A valid media record and Cloudinary URL are required." }, { status: 400 });
    }

    let mediaUrl: string | null = null;
    if (type === "video") {
      const media = await prisma.video.findUnique({ where: { id }, select: { videoUrl: true } });
      mediaUrl = media?.videoUrl ?? null;
    } else {
      const media = await prisma.podcast.findUnique({ where: { id }, select: { audioUrl: true, videoUrl: true } });
      mediaUrl = media?.audioUrl ?? media?.videoUrl ?? null;
    }
    if (!mediaUrl || mediaUrl !== body.mediaUrl || !validMediaUrl(mediaUrl)) {
      return NextResponse.json({ error: "The media URL does not match the selected record." }, { status: 400 });
    }

    const mediaResponse = await fetch(mediaUrl, { signal: AbortSignal.timeout(30000), redirect: "error" });
    if (!mediaResponse.ok) return NextResponse.json({ error: "Could not retrieve the media file." }, { status: 502 });
    const declaredLength = Number(mediaResponse.headers.get("content-length") || 0);
    if (declaredLength > MAX_MEDIA_BYTES) return NextResponse.json({ error: "Media exceeds the 24 MB transcription limit." }, { status: 413 });
    const bytes = await mediaResponse.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_MEDIA_BYTES) return NextResponse.json({ error: "Media must be between 1 byte and 24 MB." }, { status: 413 });

    const form = new FormData();
    const extension = new URL(mediaUrl).pathname.split(".").pop()?.toLowerCase() || "mp4";
    form.append("file", new Blob([bytes], { type: mediaResponse.headers.get("content-type") || "application/octet-stream" }), `africana-media.${extension}`);
    form.append("model", "whisper-1");
    form.append("response_format", "vtt");
    const transcription = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form, signal: AbortSignal.timeout(55000),
    });
    const transcriptVtt = await transcription.text();
    if (!transcription.ok || !transcriptVtt.trim().startsWith("WEBVTT")) {
      console.error("AI transcription provider error:", transcription.status);
      return NextResponse.json({ error: "Transcription failed. Check the media format and try again." }, { status: 502 });
    }
    if (type === "video") await prisma.video.update({ where: { id }, data: { transcriptVtt, transcriptApproved: false } });
    else await prisma.podcast.update({ where: { id }, data: { transcriptVtt, transcriptApproved: false } });
    return NextResponse.json({ transcriptVtt, approved: false });
  } catch (error) {
    console.error("AI transcription failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Transcription could not be completed." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const id = Number(body.id);
    const type = body.type as MediaType;
    const transcriptVtt = typeof body.transcriptVtt === "string" ? body.transcriptVtt : null;
    if (!Number.isSafeInteger(id) || id < 1 || !["video", "podcast"].includes(type) || !transcriptVtt || transcriptVtt.length > 500000 || !transcriptVtt.startsWith("WEBVTT")) {
      return NextResponse.json({ error: "A valid WebVTT transcript is required." }, { status: 400 });
    }
    const transcriptApproved = body.approved === true;
    const media = type === "video"
      ? await prisma.video.update({ where: { id }, data: { transcriptVtt, transcriptApproved }, select: { transcriptVtt: true, transcriptApproved: true } })
      : await prisma.podcast.update({ where: { id }, data: { transcriptVtt, transcriptApproved }, select: { transcriptVtt: true, transcriptApproved: true } });
    return NextResponse.json({ transcriptVtt: media.transcriptVtt, approved: media.transcriptApproved });
  } catch (error) {
    console.error("Transcript review save failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not save the reviewed transcript." }, { status: 500 });
  }
}
