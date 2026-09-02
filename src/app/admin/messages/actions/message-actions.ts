"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markMessageAsRead(id: number) {
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
  await prisma.contactMessage.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/messages");
}