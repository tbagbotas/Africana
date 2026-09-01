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

    if (!article.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 400 }
      );
    }

    if (
      article.status === "scheduled" &&
      (!article.publishDate || !article.publishTime)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Publish date and publish time are required for scheduled articles.",
        },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(article.title);

    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    let publishedAt = new Date();

    if (article.status === "scheduled") {
      publishedAt = new Date(
        `${article.publishDate}T${article.publishTime}`
      );
    }

    const data = {
      title: article.title.trim(),

      slug: uniqueSlug,

      subtitle: article.subtitle || "",

      excerpt:
        article.excerpt ||
        (article.content
          ? article.content.replace(/<[^>]*>/g, "").substring(0, 180)
          : ""),

      content: article.content || "",

      author: article.author || "Africana News",

      category: article.category || "General",

      location: article.location || "",

      image: article.image || "",

      tags: article.tags || "",

      readTime: article.readTime || "5 min",

      seoTitle: article.seoTitle || "",

      metaDescription: article.metaDescription || "",

      keywords: article.keywords || "",

      featured: article.featured ?? false,

      trending: article.trending ?? false,

      breaking: article.breaking ?? false,

      status: article.status || "draft",

      published: article.status === "published",

      publishedAt,
    };

    /*
     * If an existing article ID is supplied,
     * update that article instead of creating a duplicate.
     */
    if (article.id) {
      const articleId = Number(article.id);

      if (!Number.isNaN(articleId)) {
        const existingArticle = await prisma.article.findUnique({
          where: {
            id: articleId,
          },
        });

        if (existingArticle) {
          const updatedArticle = await prisma.article.update({
            where: {
              id: articleId,
            },
            data: {
              ...data,
              slug: existingArticle.slug,
            },
          });

          let message = "Article updated successfully.";

          if (article.status === "published") {
            message = "Article published successfully.";
          }

          if (article.status === "scheduled") {
            message = "Article scheduled successfully.";
          }

          if (article.status === "draft") {
            message = "Article saved as draft.";
          }

          return NextResponse.json({
            success: true,
            message,
            article: updatedArticle,
          });
        }
      }
    }

    /*
     * No existing article ID means this is a new article.
     */
    const savedArticle = await prisma.article.create({
      data,
    });

    let message = "Article saved successfully.";

    if (article.status === "published") {
      message = "Article published successfully.";
    }

    if (article.status === "scheduled") {
      message = "Article scheduled successfully.";
    }

    if (article.status === "draft") {
      message = "Article saved as draft.";
    }

    return NextResponse.json({
      success: true,
      message,
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