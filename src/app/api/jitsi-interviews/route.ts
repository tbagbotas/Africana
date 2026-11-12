
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin-api";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminApi())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const interviews = await prisma.jitsiInterview.findMany({
      include: {
        guests: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            inviteToken: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Invitation tokens are returned only to the authenticated
    // administrator. Do not expose usable tokens for ended interviews.
    const safeInterviews = interviews.map((interview) => ({
      ...interview,
      guests: interview.guests.map((guest) => {
        const { inviteToken, ...guestDetails } = guest;

        if (interview.status === "ENDED") {
          return guestDetails;
        }

        return {
          ...guestDetails,
          inviteToken,
        };
      }),
    }));

    return NextResponse.json({ interviews: safeInterviews });
  } catch (error) {
    console.error("Failed to load Jitsi interviews:", error);

    return NextResponse.json(
      { error: "Unable to load interviews." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const guestName =
      typeof body.guestName === "string" ? body.guestName.trim() : "";
    const guestEmail =
      typeof body.guestEmail === "string"
        ? body.guestEmail.trim()
        : "";

    if (!title || !guestName) {
      return NextResponse.json(
        { error: "Interview title and guest name are required." },
        { status: 400 },
      );
    }

    if (
      title.length > 200 ||
      guestName.length > 200 ||
      guestEmail.length > 320
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long." },
        { status: 400 },
      );
    }

    const roomName = `Africana-${randomBytes(16).toString("hex")}`;
    const inviteToken = randomBytes(32).toString("hex");

    const interview = await prisma.jitsiInterview.create({
      data: {
        title,
        roomName,
        guests: {
          create: {
            name: guestName,
            email: guestEmail || null,
            inviteToken,
          },
        },
      },
      include: {
        guests: {
          select: {
            id: true,
            name: true,
            email: true,
            inviteToken: true,
          },
        },
      },
    });

    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Jitsi interview:", error);

    return NextResponse.json(
      { error: "Unable to create the interview." },
      { status: 500 },
    );
  }
}
