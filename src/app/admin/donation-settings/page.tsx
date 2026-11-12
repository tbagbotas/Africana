import { requireAdminPage } from "@/lib/require-admin-page";
import DonationSettingsClient from "./DonationSettingsClient";

export default async function DonationSettingsPage() {
  await requireAdminPage();

  return <DonationSettingsClient />;
}