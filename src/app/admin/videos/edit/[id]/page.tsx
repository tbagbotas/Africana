import { requireAdminPage } from "@/lib/require-admin-page";
import EditVideoClient from "./EditVideoClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVideoPage({ params }: PageProps) {
  await requireAdminPage();

  const { id } = await params;

  return <EditVideoClient params={Promise.resolve({ id })} />;
}