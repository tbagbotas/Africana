
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
        folder: "africana/videos",
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

    const videos = await prisma.video.findMany({
      where: isAdmin ? {} : { published: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("VIDEO GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load videos.",
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

    if (!(video instanceof File) || video.size === 0) {
      return NextResponse.json(
        { success: false, message: "Please upload a video file." },
        { status: 400 }
      );
    }

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    const videoUrl = await uploadToCloudinary(video, "video");

    let thumbnailUrl: string | undefined;

    if (thumbnail instanceof File && thumbnail.size > 0) {
      thumbnailUrl = await uploadToCloudinary(thumbnail, "image");
    }

    const createdVideo = await prisma.video.create({
      data: {
        title,
        slug,
        description,
        category,
        duration: duration || null,
        featured,
        published,
        videoUrl,
        thumbnail: thumbnailUrl || null,
        ...(published ? { publishedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Video created successfully.",
      video: createdVideo,
    });
  } catch (error) {
    console.error("VIDEO UPLOAD ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Video upload failed." },
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

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const id = Number(body.id);

      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json(
          { success: false, message: "Valid video ID is required." },
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

      const video = await prisma.video.update({
        where: { id },
        data: changes,
      });

      return NextResponse.json({
        success: true,
        message: "Video updated successfully.",
        video,
      });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const id = Number(formData.get("id"));

      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json(
          { success: false, message: "Valid video ID is required." },
          { status: 400 }
        );
      }

      const existingVideo = await prisma.video.findUnique({
        where: { id },
      });

      if (!existingVideo) {
        return NextResponse.json(
          { success: false, message: "Video not found." },
          { status: 404 }
        );
      }

      const title = formData.get("title")?.toString().trim();
      const description = formData.get("description")?.toString().trim();
      const category = formData.get("category")?.toString().trim();
      const duration = formData.get("duration")?.toString().trim();

      const featured = formData.get("featured") === "true";
      const published = formData.get("published") === "true";

      if (!title || !description || !category) {
        return NextResponse.json(
          {
            success: false,
            message: "Title, description, and category are required.",
          },
          { status: 400 }
        );
      }

      const newVideoFile = formData.get("video");
      const newThumbnailFile = formData.get("thumbnail");

      let videoUrl = existingVideo.videoUrl;
      let thumbnailUrl = existingVideo.thumbnail;

      if (newVideoFile instanceof File && newVideoFile.size > 0) {
        videoUrl = await uploadToCloudinary(newVideoFile, "video");
      }

      if (newThumbnailFile instanceof File && newThumbnailFile.size > 0) {
        thumbnailUrl = await uploadToCloudinary(newThumbnailFile, "image");
      }

      const changes: {
        title: string;
        description: string;
        category: string;
        duration: string | null;
        featured: boolean;
        published: boolean;
        videoUrl: string;
        thumbnail: string | null;
        publishedAt?: Date;
      } = {
        title,
        description,
        category,
        duration: duration || null,
        featured,
        published,
        videoUrl,
        thumbnail: thumbnailUrl,
      };

      if (published && !existingVideo.published) {
        changes.publishedAt = new Date();
      }

      const updatedVideo = await prisma.video.update({
        where: { id },
        data: changes,
      });

      return NextResponse.json({
        success: true,
        message: "Video updated successfully.",
        video: updatedVideo,
      });
    }

    return NextResponse.json(
      { success: false, message: "Unsupported request format." },
      { status: 400 }
    );
  } catch (error) {
    console.error("VIDEO PATCH ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update video." },
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

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid video ID is required." },
        { status: 400 }
      );
    }

    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully.",
    });
  } catch (error) {
    console.error("VIDEO DELETE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete video." },
      { status: 500 }
    );
  }
}
