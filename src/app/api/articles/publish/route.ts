import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const article = await request.json();

    if (!article.title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 400 }
      );
    }

    const savedArticle = await prisma.article.create({
      data: {
        title: article.title,
        slug: createSlug(article.title),

        subtitle: article.subtitle || "",

        excerpt:
          article.excerpt ||
          (article.content
            ? article.content.substring(0, 180)
            : ""),

        content: article.content || "",

        author: article.author || "Africana News",
        category: article.category || "General",
        location: article.location || "",
        image: article.image || "",
        tags: article.tags || "",
        readTime: article.readTime || "5 min",

        featured: article.featured ?? false,
        trending: article.trending ?? false,
        breaking: article.breaking ?? false,

        published: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article published successfully.",
      article: savedArticle,
    });
  } catch (error) {
    console.error("Publish Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}