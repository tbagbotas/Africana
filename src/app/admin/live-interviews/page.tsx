
import { requireAdminPage } from "@/lib/require-admin-page";
import LiveInterviewsClient from "./LiveInterviewsClient";

export default async function LiveInterviewsPage() {
  await requireAdminPage();

  return <LiveInterviewsClient />;
}
