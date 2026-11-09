import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

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

    if (!article.content?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Article content is required.",
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

    const requestedSlug = createSlug(
      article.slug?.trim() || article.title
    );

    if (!requestedSlug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid article slug or title.",
        },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.article.findUnique({
      where: {
        slug: requestedSlug,
      },
      select: {
        id: true,
      },
    });

    if (existingSlug && !article.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "That article slug is already in use. Please choose a different slug.",
        },
        { status: 409 }
      );
    }

    let publishedAt = new Date();

    if (article.status === "scheduled") {
      publishedAt = new Date(
        `${article.publishDate}T${article.publishTime}`
      );

      if (Number.isNaN(publishedAt.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid publish date or time.",
          },
          { status: 400 }
        );
      }
    }

    const correspondentId =
      article.correspondentId !== null &&
      article.correspondentId !== undefined &&
      article.correspondentId !== ""
        ? Number(article.correspondentId)
        : null;

    if (
      correspondentId !== null &&
      (!Number.isInteger(correspondentId) || correspondentId < 1)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid correspondent.",
        },
        { status: 400 }
      );
    }

    if (correspondentId !== null) {
      const correspondent =
        await prisma.correspondent.findUnique({
          where: {
            id: correspondentId,
          },
          select: {
            id: true,
            published: true,
          },
        });

      if (!correspondent) {
        return NextResponse.json(
          {
            success: false,
            message: "Selected correspondent was not found.",
          },
          { status: 404 }
        );
      }
    }

    const data = {
      title: article.title.trim(),

      slug: requestedSlug,

      subtitle: article.subtitle || "",

      excerpt:
        article.excerpt ||
        (article.content
          ? article.content
              .replace(/<[^>]*>/g, "")
              .substring(0, 180)
          : ""),

      content: article.content || "",

      author: article.author || "Africana News",

      category: article.category || null,

      correspondentId,

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

    if (article.id) {
      const articleId = Number(article.id);

      if (!Number.isNaN(articleId)) {
        const existingArticle = await prisma.article.findUnique({
          where: {
            id: articleId,
          },
        });

        if (existingArticle) {
          const conflictingSlug =
            await prisma.article.findFirst({
              where: {
                slug: requestedSlug,
                NOT: {
                  id: articleId,
                },
              },
              select: {
                id: true,
              },
            });

          if (conflictingSlug) {
            return NextResponse.json(
              {
                success: false,
                message:
                  "That article slug is already in use by another article.",
              },
              { status: 409 }
            );
          }

          const updatedArticle =
            await prisma.article.update({
              where: {
                id: articleId,
              },
              data,
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