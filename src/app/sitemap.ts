import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = "https://www.africanatv.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/editorial-policy",
    "/corrections",
    "/terms",
    "/author/agbota-cyril",
  ];

  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
    })),
  ];
}
