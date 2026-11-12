import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("africana_admin");

  if (!adminCookie?.value) {
    redirect("/admin/login");
  }

  let userId: number | null = null;

  try {
    userId = verifyAdminSession(adminCookie.value);
  } catch {
    redirect("/admin/login");
  }

  if (!userId) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}