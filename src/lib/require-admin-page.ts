import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function requireAdminPage(): Promise<void> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("africana_admin");

  if (!adminCookie?.value) {
    redirect("/admin/login");
  }

  let userId: number | null;

  try {
    userId = verifyAdminSession(adminCookie.value);
  } catch {
    redirect("/admin/login");
  }

  if (!userId) {
    redirect("/admin/login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      redirect("/admin/login");
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    redirect("/admin/login");
  }
}