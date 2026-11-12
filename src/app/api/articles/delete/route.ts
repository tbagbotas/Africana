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

export async function DELETE(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await req.json();

    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid article ID is required.",
        },
        {
          status: 400,
        }
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
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete article.",
      },
      {
        status: 500,
      }
    );
  }
}