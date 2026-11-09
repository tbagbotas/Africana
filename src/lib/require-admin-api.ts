import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function requireAdminApi(): Promise<boolean> {
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
