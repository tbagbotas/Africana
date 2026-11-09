
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin-api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "A valid interview ID is required." },
        { status: 400 },
      );
    }

    const interview = await prisma.jitsiInterview.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found." },
        { status: 404 },
      );
    }

    if (interview.status === "ENDED") {
      return NextResponse.json({ interview });
    }

    const updated = await prisma.jitsiInterview.update({
      where: { id },
      data: { status: "ENDED" },
      select: { id: true, status: true },
    });

    return NextResponse.json({ interview: updated });
  } catch (error) {
    console.error("Failed to end Jitsi interview:", error);

    return NextResponse.json(
      { error: "Unable to end the interview." },
      { status: 500 },
    );
  }
}
