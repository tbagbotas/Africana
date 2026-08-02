import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Updating article:", body);

    const article = await prisma.article.update({
      where: {
        id: Number(body.id),
      },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        category: body.category,
        author: body.author,
        content: body.content,
        excerpt: body.content
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 220),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("UPDATE ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}