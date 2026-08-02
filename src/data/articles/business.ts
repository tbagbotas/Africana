import type { Article } from "@/lib/types/article";

export const businessArticles: Article[] = [
  {
    id: 101,
    slug: "african-banks-expand-digital-services",
    title: "African Banks Expand Digital Services",
    subtitle:
      "Banks across Africa are investing heavily in digital banking platforms.",
    category: "Business",
    tags: ["Banking", "Finance", "Digital"],
    author: "Business Desk",
    location: "Lagos, Nigeria",
    image: "/images/business.jpg",
    imageCaption: "Customers using digital banking services.",
    publishedAt: "July 26, 2026",
    updatedAt: "July 26, 2026",
    readTime: "4 min read",
    featured: false,
    trending: true,
    excerpt:
      "Financial institutions are accelerating digital transformation to improve customer experience.",
    content: `
Major banks across Africa are introducing new digital services to make
banking faster and more accessible.

Industry experts say mobile banking and online payments continue to
drive financial inclusion across the continent.
    `,
  },

  {
    id: 102,
    slug: "manufacturing-sector-sees-steady-growth",
    title: "Manufacturing Sector Sees Steady Growth",
    subtitle:
      "New investments are creating jobs and boosting industrial production.",
    category: "Business",
    tags: ["Manufacturing", "Industry", "Economy"],
    author: "Economic Correspondent",
    location: "Johannesburg, South Africa",
    image: "/images/business2.jpg",
    imageCaption: "Modern manufacturing facility.",
    publishedAt: "July 24, 2026",
    updatedAt: "July 24, 2026",
    readTime: "5 min read",
    featured: false,
    trending: false,
    excerpt:
      "Industrial production continues to expand as companies invest in modern facilities.",
    content: `
Manufacturing companies are increasing production following strong
investment in equipment and workforce development.

Economists believe continued investment will strengthen exports and
support long-term economic growth.
    `,
  },
];