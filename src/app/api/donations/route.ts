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
    select: {
      role: true,
    },
  });

  return user?.role === "admin";
}

export async function GET() {
  try {
    const settings = await prisma.donationSettings.findUnique({
      where: {
        id: 1,
      },
    });

    return NextResponse.json({
      success: true,
      settings: settings
        ? {
            bankName: settings.bankName || "",
            accountName: settings.accountName || "",
            accountNumber: settings.accountNumber || "",
            bankEnabled: settings.bankEnabled,
          }
        : {
            bankName: "",
            accountName: "",
            accountNumber: "",
            bankEnabled: false,
          },
    });
  } catch (error) {
    console.error("Get donation settings error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load donation settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    const bankName = String(body.bankName || "").trim();
    const accountName = String(body.accountName || "").trim();
    const accountNumber = String(body.accountNumber || "").trim();
    const bankEnabled = Boolean(body.bankEnabled);

    if (bankEnabled) {
      if (!bankName || !accountName || !accountNumber) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Bank name, account name and account number are required when bank transfer is enabled.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const settings = await prisma.donationSettings.upsert({
      where: {
        id: 1,
      },
      create: {
        id: 1,
        bankName: bankName || null,
        accountName: accountName || null,
        accountNumber: accountNumber || null,
        bankEnabled,
      },
      update: {
        bankName: bankName || null,
        accountName: accountName || null,
        accountNumber: accountNumber || null,
        bankEnabled,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Donation settings saved successfully.",
      settings: {
        bankName: settings.bankName || "",
        accountName: settings.accountName || "",
        accountNumber: settings.accountNumber || "",
        bankEnabled: settings.bankEnabled,
      },
    });
  } catch (error) {
    console.error("Save donation settings error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save donation settings.",
      },
      {
        status: 500,
      }
    );
  }
}