
import { requireAdminPage } from "@/lib/require-admin-page";
import NewArticleClient from "./NewArticleClient";

export default async function NewArticlePage() {
  await requireAdminPage();

  return <NewArticleClient />;
}
