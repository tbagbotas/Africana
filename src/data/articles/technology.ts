import type { Article } from "@/lib/types/article";

export const technologyArticles: Article[] = [
  {
    id: 301,
    slug: "african-startups-drive-ai-innovation",
    title: "African Startups Drive AI Innovation",
    subtitle:
      "Artificial intelligence companies across Africa continue attracting global investment.",
    category: "Technology",
    tags: ["AI", "Startups", "Innovation"],
    author: "Tech Desk",
    location: "Lagos, Nigeria",
    image: "/images/technology.jpg",
    imageCaption: "Developers working on AI solutions.",
    publishedAt: "July 26, 2026",
    updatedAt: "July 26, 2026",
    readTime: "5 min read",
    featured: true,
    trending: true,
    excerpt:
      "Technology startups are expanding AI solutions for healthcare, finance and education.",
    content: `
Artificial intelligence startups across Africa continue to grow rapidly.

Investors are supporting companies developing solutions in healthcare,
education, agriculture and financial technology.

Experts believe innovation will create thousands of skilled jobs across
the continent over the coming years.
    `,
  },

  {
    id: 302,
    slug: "mobile-payment-platforms-expand",
    title: "Mobile Payment Platforms Expand Across Africa",
    subtitle:
      "Digital payments continue replacing cash transactions in many regions.",
    category: "Technology",
    tags: ["FinTech", "Payments", "Digital"],
    author: "Technology Correspondent",
    location: "Nairobi, Kenya",
    image: "/images/technology2.jpg",
    imageCaption: "Customer using a mobile payment application.",
    publishedAt: "July 24, 2026",
    updatedAt: "July 24, 2026",
    readTime: "4 min read",
    featured: false,
    trending: false,
    excerpt:
      "Digital payment services continue expanding across African markets.",
    content: `
Banks and technology companies are introducing faster mobile payment
systems to improve financial inclusion.

Consumers increasingly prefer secure digital payments for shopping,
transportation and everyday services.
    `,
  },
];