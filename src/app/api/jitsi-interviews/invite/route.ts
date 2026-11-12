
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();

  if (!token || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
    return NextResponse.json(
      { error: "Invalid or missing invitation token." },
      { status: 400 },
    );
  }

  try {
    const guest = await prisma.jitsiInterviewGuest.findUnique({
      where: { inviteToken: token },
      select: {
        name: true,
        interview: {
          select: {
            title: true,
            roomName: true,
            status: true,
          },
        },
      },
    });

    if (!guest || guest.interview.status === "ENDED") {
      return NextResponse.json(
        { error: "This invitation is invalid or the interview has ended." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        interview: {
          title: guest.interview.title,
          roomName: guest.interview.roomName,
        },
        guest: {
          name: guest.name,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Failed to validate Jitsi invitation:", error);

    return NextResponse.json(
      { error: "Unable to verify the invitation right now." },
      { status: 500 },
    );
  }
}
