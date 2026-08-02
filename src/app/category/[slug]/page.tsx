import { notFound } from "next/navigation";
import CategoryPage from "@/app/components/CategoryPage";

import { africaArticles } from "@/data/articles/africa";
import { businessArticles } from "@/data/articles/business";
import { politicsArticles } from "@/data/articles/politics";
import { technologyArticles } from "@/data/articles/technology";
import { sportsArticles } from "@/data/articles/sports";
import { worldArticles } from "@/data/articles/world";
import { entertainmentArticles } from "@/data/articles/entertainment";
import { climateArticles } from "@/data/articles/climate";

const categories = {
  africa: {
    title: "Africa",
    description: "Latest news from across Africa.",
    articles: africaArticles,
  },
  business: {
    title: "Business",
    description: "Business, finance and economy news.",
    articles: businessArticles,
  },
  politics: {
    title: "Politics",
    description: "Politics and government news.",
    articles: politicsArticles,
  },
  technology: {
    title: "Technology",
    description: "Technology and innovation news.",
    articles: technologyArticles,
  },
  sports: {
    title: "Sports",
    description: "Sports news from Africa and around the world.",
    articles: sportsArticles,
  },
  world: {
    title: "World",
    description: "International news and global events.",
    articles: worldArticles,
  },
  entertainment: {
    title: "Entertainment",
    description: "Movies, music and entertainment news.",
    articles: entertainmentArticles,
  },
  climate: {
    title: "Climate",
    description: "Climate and environmental news.",
    articles: climateArticles,
  },
};

type CategorySlug = keyof typeof categories;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Category({
  params,
}: PageProps) {
  const { slug } = await params;

  const category = categories[slug as CategorySlug];

  if (!category) {
    notFound();
  }

  return (
    <CategoryPage
      title={category.title}
      description={category.description}
      articles={category.articles}
    />
  );
}