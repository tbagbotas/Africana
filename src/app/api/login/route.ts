import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/admin-auth";
import { redis } from "@/lib/redis";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

const RATE_LIMIT_SCRIPT = `
  local attempts = redis.call("INCR", KEYS[1])
  if attempts == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end
  return attempts
`;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "unknown";

    const ipHash = createHash("sha256").update(ip).digest("hex");
    const rateLimitKey = `africana:login:${ipHash}`;

    const attempts = Number(
      await redis.eval(
        RATE_LIMIT_SCRIPT,
        [rateLimitKey],
        [String(WINDOW_SECONDS)]
      )
    );

    if (attempts > MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatches || user.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await redis.del(rateLimitKey);

    const session = createAdminSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("africana_admin", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Login service temporarily unavailable." },
      { status: 503 }
    );
  }
}