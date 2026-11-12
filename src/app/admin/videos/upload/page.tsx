
import { requireAdminPage } from "@/lib/require-admin-page";
import VideoUploadClient from "./VideoUploadClient";

export default async function VideoUploadPage() {
  await requireAdminPage();

  return <VideoUploadClient />;
}
