import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Updating article:", body);

    const status = String(body.status || "Draft").toLowerCase();

    const articleId = Number(body.id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid article ID.",
        },
        {
          status: 400,
        }
      );
    }

    let publishedAt: Date | null = null;

    if (status === "published") {
      publishedAt = new Date();
    }

    if (
      status === "scheduled" &&
      body.publishDate &&
      body.publishTime
    ) {
      const scheduledDate = new Date(
        `${body.publishDate}T${body.publishTime}`
      );

      if (Number.isNaN(scheduledDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid publish date or time.",
          },
          {
            status: 400,
          }
        );
      }

      publishedAt = scheduledDate;
    }

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },

      data: {
        title: body.title || "",
        subtitle: body.subtitle || "",
        category: body.category || "Africa",
        author: body.author || "Africana News",
        image: body.image || null,
        content: body.content || "",

        location: body.location || "",
        readTime: body.readTime || "5 min",

        seoTitle: body.seoTitle || "",
        metaDescription: body.metaDescription || "",
        keywords: body.keywords || "",

        excerpt: String(body.content || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 220),

        status,

        published: status === "published",

        featured: Boolean(body.featured),
        trending: Boolean(body.trending),
               breaking: Boolean(body.breaking),

        publishedAt: publishedAt ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}