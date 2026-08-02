import { africaArticles } from "./africa";
import { businessArticles } from "./business";
import { climateArticles } from "./climate";
import { entertainmentArticles } from "./entertainment";
import { politicsArticles } from "./politics";
import { sportsArticles } from "./sports";
import { technologyArticles } from "./technology";
import { worldArticles } from "./world";

export const articles = [
  ...worldArticles,
  ...technologyArticles,
  ...sportsArticles,
  ...entertainmentArticles,
  ...climateArticles,
  ...businessArticles,
  ...politicsArticles,
  ...africaArticles,
];