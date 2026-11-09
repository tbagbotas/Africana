import { requireAdminPage } from "@/lib/require-admin-page";
import VideosClient from "./VideosClient";

export default async function AdminVideosPage() {
  await requireAdminPage();

  return <VideosClient />;
}