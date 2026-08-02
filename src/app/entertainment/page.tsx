import CategoryPage from "@/app/components/CategoryPage";
import { entertainmentArticles } from "@/data/articles/entertainment";

export default function EntertainmentPage() {
  return (
    <CategoryPage
      title="Entertainment"
      description="The latest entertainment news, movies, music and culture from across Africa."
      articles={entertainmentArticles}
    />
  );
}