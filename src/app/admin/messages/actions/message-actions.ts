"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

async function requireAdmin() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("africana_admin");

  if (!adminCookie?.value) {
    throw new Error("Unauthorized");
  }

  let userId: number | null = null;

  try {
    userId = verifyAdminSession(adminCookie.value);
  } catch {
    throw new Error("Unauthorized");
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function markMessageAsRead(id: number) {
  await requireAdmin();

  await prisma.contactMessage.update({
    where: {
      id,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/admin/messages");
}

export async function markMessageAsUnread(id: number) {
  await requireAdmin();

  await prisma.contactMessage.update({
    where: {
      id,
    },
    data: {
      read: false,
    },
  });

  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: number) {
  await requireAdmin();

  await prisma.contactMessage.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/messages");
}