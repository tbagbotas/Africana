import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AdminArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}