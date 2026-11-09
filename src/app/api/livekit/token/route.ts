
import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

async function requireAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("africana_admin");

    if (!adminCookie?.value) return false;

    const userId = verifyAdminSession(adminCookie.value);
    if (!userId) return false;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const roomName =
      typeof body.roomName === "string" ? body.roomName.trim() : "";
    const participantIdentity =
      typeof body.participantIdentity === "string"
        ? body.participantIdentity.trim()
        : "";
    const participantName =
      typeof body.participantName === "string"
        ? body.participantName.trim()
        : "";
    const inviteToken =
      typeof body.inviteToken === "string" ? body.inviteToken.trim() : "";

    if (!roomName || !participantIdentity) {
      return NextResponse.json(
        { error: "roomName and participantIdentity are required" },
        { status: 400 }
      );
    }

    // Hosts must have a valid Africana admin session.
    if (participantIdentity.startsWith("host-")) {
      if (!(await requireAdmin())) {
        return NextResponse.json(
          { error: "Unauthorized host." },
          { status: 401 }
        );
      }
    } else {
      // Guests must present a valid invitation token.
      if (!inviteToken) {
        return NextResponse.json(
          { error: "A valid invitation token is required." },
          { status: 401 }
        );
      }

      const guest = await prisma.liveInterviewGuest.findUnique({
        where: { inviteToken },
        include: {
          interview: {
            select: { roomName: true, status: true },
          },
        },
      });

      if (guest) {
        if (
          guest.interview.roomName !== roomName ||
          guest.interview.status === "ENDED" ||
          participantIdentity !== `guest-${guest.id}`
        ) {
          return NextResponse.json(
            { error: "This invitation is invalid or has ended." },
            { status: 403 }
          );
        }
      } else {
        // Support older interview-level invitation links.
        const interview = await prisma.liveInterview.findUnique({
          where: { inviteToken },
          select: { roomName: true, status: true },
        });

        if (
          !interview ||
          interview.roomName !== roomName ||
          interview.status === "ENDED" ||
          !participantIdentity.startsWith("guest-")
        ) {
          return NextResponse.json(
            { error: "This invitation is invalid or has ended." },
            { status: 403 }
          );
        }
      }
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      return NextResponse.json(
        { error: "LiveKit environment variables are not configured" },
        { status: 500 }
      );
    }

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName || participantIdentity,
      ttl: "1h",
    });

    accessToken.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await accessToken.toJwt();

    return NextResponse.json({
      serverUrl: livekitUrl,
      participantToken: token,
    });
  } catch (error) {
    console.error("LiveKit token error:", error);

    return NextResponse.json(
      { error: "Failed to generate LiveKit token" },
      { status: 500 }
    );
  }
}
