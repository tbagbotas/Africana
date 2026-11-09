
import { NextRequest, NextResponse } from "next/server";
import { EgressClient, StreamOutput, StreamProtocol } from "livekit-server-sdk";
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
    const roomName = body.roomName;

    if (!roomName) {
      return NextResponse.json(
        { error: "roomName is required" },
        { status: 400 }
      );
    }

    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const rtmpsUrl = process.env.CLOUDFLARE_RTMPS_URL;
    const rtmpsKey = process.env.CLOUDFLARE_RTMPS_KEY;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit environment variables are not configured" },
        { status: 500 }
      );
    }

    if (!rtmpsUrl || !rtmpsKey) {
      return NextResponse.json(
        { error: "Cloudflare RTMPS environment variables are not configured" },
        { status: 500 }
      );
    }

    const streamUrl = `${rtmpsUrl.replace(/\/+$/, "")}/${rtmpsKey}`;

    const egressClient = new EgressClient(
      livekitUrl,
      apiKey,
      apiSecret
    );

    const output = new StreamOutput({
      protocol: StreamProtocol.RTMP,
      urls: [streamUrl],
    });

    const egress = await egressClient.startRoomCompositeEgress(
      roomName,
      output,
      { layout: "grid" }
    );

    return NextResponse.json({
      success: true,
      egressId: egress.egressId,
      roomName,
    });
  } catch (error) {
    console.error("LiveKit broadcast start error:", error);

    return NextResponse.json(
      { error: "Failed to start broadcast" },
      { status: 500 }
    );
  }
}
