
import { NextRequest, NextResponse } from "next/server";
import { EgressClient } from "livekit-server-sdk";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdminApi())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const egressId = body.egressId;

    if (!egressId) {
      return NextResponse.json(
        { error: "egressId is required" },
        { status: 400 }
      );
    }

    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit environment variables are not configured" },
        { status: 500 }
      );
    }

    const egressClient = new EgressClient(
      livekitUrl,
      apiKey,
      apiSecret
    );

    await egressClient.stopEgress(egressId);

    return NextResponse.json({
      success: true,
      egressId,
    });
  } catch (error) {
    console.error("LiveKit broadcast stop error:", error);

    return NextResponse.json(
      { error: "Failed to stop broadcast" },
      { status: 500 }
    );
  }
}
