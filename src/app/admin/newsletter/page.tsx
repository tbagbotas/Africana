
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import NewsletterSubscribers from "./NewsletterSubscribers";
import { requireAdminPage } from "@/lib/require-admin-page";

export default async function NewsletterAdminPage() {
  // Protect subscriber information: administrators only.
  await requireAdminPage();

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      subscribedAt: "desc",
    },
  });

  return (
    <NewsletterSubscribers
      subscribers={subscribers.map((subscriber) => ({
        id: subscriber.id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt.toISOString(),
      }))}
    />
  );
}
