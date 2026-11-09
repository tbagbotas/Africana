
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin-api";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const correspondents = await prisma.correspondent.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      correspondents,
    });
  } catch (error) {
    console.error("Get correspondents error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load correspondents.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdminApi())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Correspondent name is required." },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(name);

    if (!baseSlug) {
      return NextResponse.json(
        { error: "A valid correspondent name is required." },
        { status: 400 }
      );
    }

    let slug = baseSlug;
    let counter = 2;

    while (await prisma.correspondent.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const correspondent = await prisma.correspondent.create({
      data: {
        name,
        slug,
        photo: body.photo ? String(body.photo).trim() : null,
        country: body.country ? String(body.country).trim() : null,
        city: body.city ? String(body.city).trim() : null,
        bio: body.bio ? String(body.bio).trim() : null,
        specialization: body.specialization
          ? String(body.specialization).trim()
          : null,
        email: body.email ? String(body.email).trim() : null,
        website: body.website ? String(body.website).trim() : null,
        socialLinks: body.socialLinks
          ? String(body.socialLinks).trim()
          : null,
        published: Boolean(body.published),
      },
    });

    return NextResponse.json(
      {
        message: "Correspondent created successfully.",
        correspondent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create correspondent error:", error);

    return NextResponse.json(
      { error: "Failed to create correspondent." },
      { status: 500 }
    );
  }
}
