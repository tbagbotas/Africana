import type { Article } from "@/lib/types/article";

export const entertainmentArticles: Article[] = [
  {
    id: 601,
    slug: "african-film-festival-attracts-global-audience",
    title: "African Film Festival Attracts Global Audience",
    subtitle:
      "Filmmakers from across the continent showcase award-winning productions.",
    category: "Entertainment",
    tags: ["Movies", "Culture", "Festival"],
    author: "Entertainment Desk",
    location: "Lagos, Nigeria",
    image: "/images/hero.jpg",
    imageCaption: "Guests attending the African Film Festival.",
    publishedAt: "July 26, 2026",
    updatedAt: "July 26, 2026",
    readTime: "4 min read",
    featured: true,
    trending: true,
    excerpt:
      "African filmmakers continue gaining international recognition through major festivals.",
    content: `
The African Film Festival welcomed producers, actors and directors from
across the continent.

New films highlighting African stories received praise from international
audiences and critics.

Organizers say the festival continues to strengthen Africa's creative
industry worldwide.
    `,
  },

  {
    id: 602,
    slug: "music-streaming-reaches-new-milestone",
    title: "African Music Streaming Reaches New Milestone",
    subtitle:
      "Streaming platforms report record growth for African artists.",
    category: "Entertainment",
    tags: ["Music", "Streaming", "Artists"],
    author: "Music Reporter",
    location: "Johannesburg, South Africa",
    image: "/images/podcast.jpg",
    imageCaption: "Music fans enjoying a live performance.",
    publishedAt: "July 24, 2026",
    updatedAt: "July 24, 2026",
    readTime: "3 min read",
    featured: false,
    trending: false,
    excerpt:
      "African musicians continue reaching millions of listeners worldwide.",
    content: `
Streaming services report significant growth in audiences listening to
African music.

Industry experts expect the continent's music industry to continue
expanding through digital platforms.
    `,
  },
];