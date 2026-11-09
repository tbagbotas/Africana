
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function GET() {
  try {
    if (!(await requireAdminApi())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const interviews = await prisma.liveInterview.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        guests: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Live interviews GET error:", error);

    return NextResponse.json(
      { error: "Failed to load live interviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdminApi())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const title = body.title?.trim();

    let guests = Array.isArray(body.guests)
      ? body.guests
          .map((guest: {
            name?: string;
            email?: string;
            location?: string;
          }) => ({
            name: guest.name?.trim(),
            email: guest.email?.trim() || null,
            location: guest.location?.trim() || null,
          }))
          .filter((guest: { name?: string }) => guest.name)
      : [];

    // Keep compatibility with the existing admin form.
    if (guests.length === 0 && body.guestName?.trim()) {
      guests = [
        {
          name: body.guestName.trim(),
          email: body.guestEmail?.trim() || null,
          location: body.guestLocation?.trim() || null,
        },
      ];
    }

    if (!title || guests.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one guest are required" },
        { status: 400 }
      );
    }

    if (guests.length > 5) {
      return NextResponse.json(
        { error: "A maximum of 5 guests is allowed" },
        { status: 400 }
      );
    }

    const interviewDate = body.interviewDate
      ? new Date(body.interviewDate)
      : null;

    const roomName = `africana-interview-${crypto
      .randomBytes(16)
      .toString("hex")}`;

    // The first guest keeps the original interview invite token
    // so existing guest links continue to work.
    const firstInviteToken = crypto.randomBytes(32).toString("hex");

    const guestRecords = guests.map(
      (
        guest: {
          name: string;
          email: string | null;
          location: string | null;
        },
        index: number
      ) => ({
        name: guest.name,
        email: guest.email,
        location: guest.location,
        inviteToken:
          index === 0
            ? firstInviteToken
            : crypto.randomBytes(32).toString("hex"),
      })
    );

    const firstGuest = guests[0];

    const interview = await prisma.liveInterview.create({
      data: {
        title,
        guestName: firstGuest.name,
        guestEmail: firstGuest.email,
        guestLocation: firstGuest.location,
        interviewDate,
        roomName,
        inviteToken: firstInviteToken,
        status: "WAITING",
        guests: {
          create: guestRecords,
        },
      },
      include: {
        guests: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error("Live interviews POST error:", error);

    return NextResponse.json(
      { error: "Failed to create live interview" },
      { status: 500 }
    );
  }
}
