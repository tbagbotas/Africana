import type { Article } from "@/lib/types/article";

export const politicsArticles: Article[] = [
  {
    id: 201,
    slug: "regional-leaders-sign-new-trade-agreement",
    title: "Regional Leaders Sign New Trade Agreement",
    subtitle:
      "The agreement is expected to strengthen economic cooperation across Africa.",
    category: "Politics",
    tags: ["Trade", "Government", "Economy"],
    author: "Political Desk",
    location: "Accra, Ghana",
    image: "/images/politics.jpg",
    imageCaption: "Regional leaders during the signing ceremony.",
    publishedAt: "July 26, 2026",
    updatedAt: "July 26, 2026",
    readTime: "5 min read",
    featured: false,
    trending: true,
    excerpt:
      "Government leaders have signed a new agreement aimed at increasing regional trade and investment.",
    content: `
Leaders from several African countries signed a regional trade agreement
designed to improve economic cooperation and remove barriers to commerce.

Officials believe the agreement will encourage investment, create jobs,
and strengthen partnerships between neighboring countries.
    `,
  },

  {
    id: 202,
    slug: "parliament-approves-national-development-plan",
    title: "Parliament Approves National Development Plan",
    subtitle:
      "Lawmakers voted in favor of a long-term strategy for infrastructure and public services.",
    category: "Politics",
    tags: ["Parliament", "Development", "Infrastructure"],
    author: "Government Reporter",
    location: "Kigali, Rwanda",
    image: "/images/politics2.jpg",
    imageCaption: "Parliament members during the legislative session.",
    publishedAt: "July 23, 2026",
    updatedAt: "July 23, 2026",
    readTime: "4 min read",
    featured: false,
    trending: false,
    excerpt:
      "The newly approved plan focuses on transport, education, healthcare, and digital infrastructure.",
    content: `
The national development plan outlines major investments in roads,
schools, hospitals, and digital connectivity.
    `,
  },
];