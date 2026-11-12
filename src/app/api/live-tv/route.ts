import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

const PLATFORMS = [
  "YouTube Live",
  "Twitch",
  "Facebook Live",
  "KICK",
  "TikTok Live",
  "X Live",
  "Africana Stream / CDN",
  "HLS (.m3u8)",
  "Custom Stream",
];

const STATUSES = ["LIVE", "OFFLINE", "STARTING SOON", "ENDED"];

const DEFAULT_DESCRIPTION =
  "Africana Live TV brings you breaking news, interviews, documentaries, special events and live coverage from Africa and around the world.";

async function requireAdmin() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("africana_admin");

  if (!adminCookie?.value) {
    return false;
  }

  let userId: number | null = null;

  try {
    userId = verifyAdminSession(adminCookie.value);
  } catch {
    return false;
  }

  if (!userId) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user?.role === "admin";
}

export async function GET() {
  try {
    let liveTV = await prisma.liveTV.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    if (!liveTV) {
      liveTV = await prisma.liveTV.create({
        data: {
          platform: "YouTube Live",
          status: "OFFLINE",
          streamTitle: "Africana Live TV",
          channelName: "",
          streamUrl: "",
          description: DEFAULT_DESCRIPTION,
        },
      });
    }

    return NextResponse.json(liveTV);
  } catch (error) {
    console.error("GET /api/live-tv error:", error);

    return NextResponse.json(
      { error: "Failed to load Live TV settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      platform,
      status,
      streamTitle,
      channelName,
      streamUrl,
      description,
    } = body;

    if (!platform || !PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid streaming platform." },
        { status: 400 }
      );
    }

    if (!status || !STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid channel status." },
        { status: 400 }
      );
    }

    if (!streamTitle || typeof streamTitle !== "string") {
      return NextResponse.json(
        { error: "Stream title is required." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required." },
        { status: 400 }
      );
    }

    const cleanStreamUrl =
      typeof streamUrl === "string" ? streamUrl.trim() : "";

    if (status === "LIVE" && !cleanStreamUrl) {
      return NextResponse.json(
        {
          error:
            "A stream URL is required before the channel can be LIVE.",
        },
        { status: 400 }
      );
    }

    if (platform === "HLS (.m3u8)" && cleanStreamUrl) {
      let parsedUrl: URL;

      try {
        parsedUrl = new URL(cleanStreamUrl);
      } catch {
        return NextResponse.json(
          { error: "Please enter a valid HLS stream URL." },
          { status: 400 }
        );
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: "The stream URL must use HTTP or HTTPS." },
          { status: 400 }
        );
      }

      if (!cleanStreamUrl.toLowerCase().includes(".m3u8")) {
        return NextResponse.json(
          {
            error:
              "HLS (.m3u8) requires a stream URL ending with or containing .m3u8.",
          },
          { status: 400 }
        );
      }
    }

    const existingLiveTV = await prisma.liveTV.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const data = {
      platform,
      status,
      streamTitle: streamTitle.trim(),
      channelName:
        typeof channelName === "string" ? channelName.trim() : "",
      streamUrl: cleanStreamUrl,
      description: description.trim(),
    };

    let liveTV;

    if (existingLiveTV) {
      liveTV = await prisma.liveTV.update({
        where: {
          id: existingLiveTV.id,
        },
        data,
      });
    } else {
      liveTV = await prisma.liveTV.create({
        data,
      });
    }

    return NextResponse.json(liveTV);
  } catch (error) {
    console.error("PUT /api/live-tv error:", error);

    return NextResponse.json(
      { error: "Failed to save Live TV settings." },
      { status: 500 }
    );
  }
}
