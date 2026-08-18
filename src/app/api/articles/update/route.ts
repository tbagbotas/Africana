import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Updating article:", body);

    const status = body.status || "draft";

    const article = await prisma.article.update({
      where: {
        id: Number(body.id),
      },

      data: {
        title: body.title,
        subtitle: body.subtitle,
        category: body.category,
        author: body.author,
        image: body.image,
        content: body.content,

        excerpt: body.content
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 220),

        status,

        published: status === "published",

        featured: body.featured ?? false,
        trending: body.trending ?? false,
        breaking: body.breaking ?? false,

        publishedAt:
          status === "published"
            ? new Date()
            : status === "scheduled" &&
                body.publishDate &&
                body.publishTime
              ? new Date(
                  `${body.publishDate}T${body.publishTime}`
                )
              : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("UPDATE ERROR:");
    console.error(error);

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