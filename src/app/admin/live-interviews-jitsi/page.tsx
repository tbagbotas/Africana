import { requireAdminPage } from "@/lib/require-admin-page";
import JitsiInterviewsClient from "./JitsiInterviewsClient";

export default async function JitsiInterviewsPage() {
  await requireAdminPage();

  return <JitsiInterviewsClient />;
}