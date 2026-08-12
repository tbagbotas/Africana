import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET;
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
      const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const now = new Date();

    const articles = await prisma.article.findMany({
      where: {
        status: "scheduled",
        published: false,
        publishedAt: {
          lte: now,
        },
      },
    });

    for (const article of articles) {
      await prisma.article.update({
        where: {
          id: article.id,
        },
        data: {
          status: "published",
          published: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      published: articles.length,
    });
  } catch (error) {
    console.error("Scheduled publish error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to publish scheduled articles.",
      },
      {
        status: 500,
      }
    );
  }
}