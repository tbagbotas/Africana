import type { Article } from "@/lib/types/article";

export const sportsArticles: Article[] = [
  {
    id: 401,
    slug: "african-teams-prepare-for-continental-championship",
    title: "African Teams Prepare for Continental Championship",
    subtitle:
      "National teams begin final preparations ahead of the tournament.",
    category: "Sports",
    tags: ["Football", "CAF", "Championship"],
    author: "Sports Desk",
    location: "Cairo, Egypt",
    image: "/images/sports.jpg",
    imageCaption: "Players training before the championship.",
    publishedAt: "July 26, 2026",
    updatedAt: "July 26, 2026",
    readTime: "4 min read",
    featured: true,
    trending: true,
    excerpt:
      "Coaches are finalizing their squads ahead of the continental competition.",
    content: `
National teams across Africa have intensified training as they prepare
for the upcoming continental championship.

Coaches are focusing on fitness, tactics and teamwork while supporters
look forward to an exciting tournament.
    `,
  },

  {
    id: 402,
    slug: "young-athletes-break-national-records",
    title: "Young Athletes Break National Records",
    subtitle:
      "A new generation of athletes continues to impress on the international stage.",
    category: "Sports",
    tags: ["Athletics", "Youth", "Records"],
    author: "Athletics Reporter",
    location: "Pretoria, South Africa",
    image: "/images/sports2.jpg",
    imageCaption: "Young athletes celebrating their achievements.",
    publishedAt: "July 24, 2026",
    updatedAt: "July 24, 2026",
    readTime: "3 min read",
    featured: false,
    trending: false,
    excerpt:
      "Several promising athletes have set new national records this season.",
    content: `
Young competitors continue to achieve impressive performances in track
and field competitions.

Sports officials believe these athletes represent the future of African
sport on the global stage.
    `,
  },
];