import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const inviteToken = request.nextUrl.searchParams.get("token");

    console.log(
      "INVITE TOKEN RECEIVED:",
      inviteToken ? `length=${inviteToken.length}` : "MISSING"
    );

    if (!inviteToken) {
      return NextResponse.json(
        { error: "Invitation token is required" },
        { status: 400 }
      );
    }

    // Look for a guest-specific invitation token.
    const guest = await prisma.liveInterviewGuest.findUnique({
      where: {
        inviteToken,
      },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            roomName: true,
            status: true,
            interviewDate: true,
          },
        },
      },
    });

    if (guest) {
      console.log(
        "GUEST INVITE LOOKUP RESULT:",
        `FOUND GUEST ID=${guest.id}, INTERVIEW ID=${guest.interview.id}`
      );

      if (guest.interview.status === "ENDED") {
        return NextResponse.json(
          { error: "This interview has ended." },
          { status: 410 }
        );
      }

      return NextResponse.json({
        id: guest.interview.id,
        title: guest.interview.title,
        guestId: guest.id,
        guestName: guest.name,
        guestEmail: guest.email,
        guestLocation: guest.location,
        interviewDate: guest.interview.interviewDate,
        roomName: guest.interview.roomName,
        status: guest.interview.status,
      });
    }

    // Keep compatibility with the original interview invitation token.
    const interview = await prisma.liveInterview.findUnique({
      where: {
        inviteToken,
      },
      select: {
        id: true,
        title: true,
        guestName: true,
        guestEmail: true,
        guestLocation: true,
        interviewDate: true,
        roomName: true,
        status: true,
      },
    });

    console.log(
      "LEGACY INVITE LOOKUP RESULT:",
      interview ? `FOUND ID=${interview.id}` : "NOT FOUND"
    );

    if (!interview) {
      return NextResponse.json(
        { error: "This invitation is invalid or no longer exists." },
        { status: 404 }
      );
    }

    if (interview.status === "ENDED") {
      return NextResponse.json(
        { error: "This interview has ended." },
        { status: 410 }
      );
    }

    return NextResponse.json({
      ...interview,
      guestId: null,
    });
  } catch (error) {
    console.error("Live interview invite error:", error);

    return NextResponse.json(
      { error: "Failed to load interview invitation" },
      { status: 500 }
    );
  }
}
