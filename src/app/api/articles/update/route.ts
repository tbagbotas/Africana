import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const status = String(
      body.status || "draft"
    ).toLowerCase();

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

    const slug = String(
      body.slug || ""
    ).trim();

    const existingArticle =
      await prisma.article.findUnique({
        where: {
          slug,
        },
      });

    if (
      existingArticle &&
      existingArticle.id !== articleId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "That slug is already in use by another article.",
        },
        {
          status: 409,
        }
      );
    }

    const correspondentId =
      body.correspondentId !== null &&
      body.correspondentId !== undefined &&
      body.correspondentId !== ""
        ? Number(body.correspondentId)
        : null;

    if (
      correspondentId !== null &&
      (!Number.isInteger(correspondentId) ||
        correspondentId < 1)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid correspondent.",
        },
        {
          status: 400,
        }
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
          },
        });

      if (!correspondent) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Selected correspondent was not found.",
          },
          {
            status: 404,
          }
        );
      }
    }

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },

      data: {
        title: body.title || "",
        slug,
        subtitle: body.subtitle || "",
        category: body.category || "Africa",

        correspondentId,

        tags: body.tags || "",
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