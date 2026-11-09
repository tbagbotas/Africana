
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin-api";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    if (!(await requireAdminApi())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const correspondentId = Number(id);

    if (!Number.isInteger(correspondentId) || correspondentId <= 0) {
      return NextResponse.json(
        { error: "Invalid correspondent ID." },
        { status: 400 }
      );
    }

    const existing = await prisma.correspondent.findUnique({
      where: { id: correspondentId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Correspondent not found." },
        { status: 404 }
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

    while (true) {
      const duplicate = await prisma.correspondent.findUnique({
        where: { slug },
      });

      if (!duplicate || duplicate.id === correspondentId) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const correspondent = await prisma.correspondent.update({
      where: { id: correspondentId },
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

    return NextResponse.json({
      message: "Correspondent updated successfully.",
      correspondent,
    });
  } catch (error) {
    console.error("Update correspondent error:", error);

    return NextResponse.json(
      { error: "Failed to update correspondent." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    if (!(await requireAdminApi())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const correspondentId = Number(id);

    if (!Number.isInteger(correspondentId) || correspondentId <= 0) {
      return NextResponse.json(
        { error: "Invalid correspondent ID." },
        { status: 400 }
      );
    }

    const existing = await prisma.correspondent.findUnique({
      where: { id: correspondentId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Correspondent not found." },
        { status: 404 }
      );
    }

    await prisma.correspondent.delete({
      where: { id: correspondentId },
    });

    return NextResponse.json({
      message: "Correspondent deleted successfully.",
    });
  } catch (error) {
    console.error("Delete correspondent error:", error);

    return NextResponse.json(
      { error: "Failed to delete correspondent." },
      { status: 500 }
    );
  }
}
