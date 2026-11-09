
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

async function requireAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("africana_admin");

    if (!adminCookie?.value) {
      return false;
    }

    const userId = verifyAdminSession(adminCookie.value);

    if (!userId) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === "admin";
  } catch {
    return false;
  }
}

async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "africana/podcasts",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export async function GET() {
  try {
    const isAdmin = await requireAdmin();

    const podcasts = await prisma.podcast.findMany({
      where: isAdmin ? {} : { published: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      podcasts,
    });
  } catch (error) {
    console.error("PODCAST GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load podcasts.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const category = formData.get("category")?.toString().trim();
    const duration = formData.get("duration")?.toString().trim();

    const featured = formData.get("featured") === "true";
    const published = formData.get("published") === "true";

    const audio = formData.get("audio");
    const video = formData.get("video");
    const thumbnail = formData.get("thumbnail");

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and category are required.",
        },
        { status: 400 }
      );
    }

    let audioUrl: string | undefined;
    let videoUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    if (audio instanceof File && audio.size > 0) {
      audioUrl = await uploadToCloudinary(audio, "video");
    }

    if (video instanceof File && video.size > 0) {
      videoUrl = await uploadToCloudinary(video, "video");
    }

    if (thumbnail instanceof File && thumbnail.size > 0) {
      thumbnailUrl = await uploadToCloudinary(thumbnail, "image");
    }

    if (!audioUrl && !videoUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload an audio or video file.",
        },
        { status: 400 }
      );
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    const podcast = await prisma.podcast.create({
      data: {
        title,
        slug,
        description,
        category,
        duration: duration || null,
        featured,
        published,
        audioUrl: audioUrl || null,
        videoUrl: videoUrl || null,
        thumbnail: thumbnailUrl || null,
        ...(published ? { publishedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Podcast created successfully.",
      podcast,
    });
  } catch (error) {
    console.error("PODCAST UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Podcast upload failed.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const id = Number(body.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid podcast ID is required." },
        { status: 400 }
      );
    }

    const changes: {
      featured?: boolean;
      published?: boolean;
      publishedAt?: Date;
    } = {};

    if (typeof body.featured === "boolean") {
      changes.featured = body.featured;
    }

    if (typeof body.published === "boolean") {
      changes.published = body.published;

      if (body.published) {
        changes.publishedAt = new Date();
      }
    }

    if (
      changes.featured === undefined &&
      changes.published === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "No valid changes provided." },
        { status: 400 }
      );
    }

    const podcast = await prisma.podcast.update({
      where: { id },
      data: changes,
    });

    return NextResponse.json({
      success: true,
      message: "Podcast updated successfully.",
      podcast,
    });
  } catch (error) {
    console.error("PODCAST PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update podcast.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const id = Number(body.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid podcast ID is required." },
        { status: 400 }
      );
    }

    await prisma.podcast.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Podcast deleted successfully.",
    });
  } catch (error) {
    console.error("PODCAST DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete podcast.",
      },
      { status: 500 }
    );
  }
}
