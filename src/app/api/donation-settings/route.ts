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

            stripeEnabled: settings.stripeEnabled,
            stripePaymentLink: settings.stripePaymentLink || "",

            paypalEnabled: settings.paypalEnabled,
            paypalPaymentLink: settings.paypalPaymentLink || "",

            gofundmeEnabled: settings.gofundmeEnabled,
            gofundmeLink: settings.gofundmeLink || "",
          }
        : {
            bankName: "",
            accountName: "",
            accountNumber: "",
            bankEnabled: false,

            stripeEnabled: false,
            stripePaymentLink: "",

            paypalEnabled: false,
            paypalPaymentLink: "",

            gofundmeEnabled: false,
            gofundmeLink: "",
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

    const stripePaymentLink = String(
      body.stripePaymentLink || ""
    ).trim();

    const paypalPaymentLink = String(
      body.paypalPaymentLink || ""
    ).trim();

    const gofundmeLink = String(
      body.gofundmeLink || ""
    ).trim();

    const bankEnabled = Boolean(body.bankEnabled);
    const stripeEnabled = Boolean(body.stripeEnabled);
    const paypalEnabled = Boolean(body.paypalEnabled);
    const gofundmeEnabled = Boolean(body.gofundmeEnabled);

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

    if (stripeEnabled && !stripePaymentLink) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Stripe Payment Link is required when Stripe is enabled.",
        },
        {
          status: 400,
        }
      );
    }

    if (paypalEnabled && !paypalPaymentLink) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PayPal Payment Link is required when PayPal is enabled.",
        },
        {
          status: 400,
        }
      );
    }

    if (gofundmeEnabled && !gofundmeLink) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GoFundMe link is required when GoFundMe is enabled.",
        },
        {
          status: 400,
        }
      );
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

        stripeEnabled,
        stripePaymentLink: stripePaymentLink || null,

        paypalEnabled,
        paypalPaymentLink: paypalPaymentLink || null,

        gofundmeEnabled,
        gofundmeLink: gofundmeLink || null,
      },

      update: {
        bankName: bankName || null,
        accountName: accountName || null,
        accountNumber: accountNumber || null,
        bankEnabled,

        stripeEnabled,
        stripePaymentLink: stripePaymentLink || null,

        paypalEnabled,
        paypalPaymentLink: paypalPaymentLink || null,

        gofundmeEnabled,
        gofundmeLink: gofundmeLink || null,
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

        stripeEnabled: settings.stripeEnabled,
        stripePaymentLink: settings.stripePaymentLink || "",

        paypalEnabled: settings.paypalEnabled,
        paypalPaymentLink: settings.paypalPaymentLink || "",

        gofundmeEnabled: settings.gofundmeEnabled,
        gofundmeLink: settings.gofundmeLink || "",
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