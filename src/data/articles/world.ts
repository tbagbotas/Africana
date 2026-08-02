import type { Article } from "@/lib/types/article";

export const worldArticles: Article[] = [
  {
    id: 501,
    slug: "global-climate-summit-opens",
    title: "Global Climate Summit Opens",
    subtitle:
      "World leaders meet to discuss climate action and sustainable development.",
    category: "World",
    tags: ["Climate", "Environment", "Diplomacy"],
    author: "World Desk",
    location: "Geneva, Switzerland",
    image: "/images/world.jpg",
    imageCaption: "Delegates gather for the global climate summit.",
    publishedAt: "July 26, 2026",
    updatedAt: "July 26, 2026",
    readTime: "5 min read",
    featured: true,
    trending: true,
    excerpt:
      "International leaders begin discussions on climate policies and global cooperation.",
    content: `
Representatives from countries around the world have gathered to discuss
climate action, renewable energy and environmental protection.

Delegates are expected to negotiate new agreements aimed at reducing
global emissions and strengthening international cooperation.
    `,
  },

  {
    id: 502,
    slug: "international-space-mission-achieves-milestone",
    title: "International Space Mission Achieves Major Milestone",
    subtitle:
      "Scientists celebrate another successful step in space exploration.",
    category: "World",
    tags: ["Space", "Science", "Technology"],
    author: "Science Correspondent",
    location: "Houston, United States",
    image: "/images/world.jpg",
    imageCaption: "Mission control celebrating the successful operation.",
    publishedAt: "July 24, 2026",
    updatedAt: "July 24, 2026",
    readTime: "4 min read",
    featured: false,
    trending: false,
    excerpt:
      "Researchers report another important achievement in international space exploration.",
    content: `
Scientists confirmed the mission successfully completed another critical
phase of its journey.

The achievement demonstrates continued international collaboration in
scientific research and space technology.
    `,
  },
];