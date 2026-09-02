import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const articleId = Number(body.id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid article ID.",
        },
        { status: 400 }
      );
    }

    await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ARTICLE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete article.",
      },
      { status: 500 }
    );
  }
}