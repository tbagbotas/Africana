
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/require-admin-page";
import EditCorrespondentForm from "../../EditCorrespondentForm";

interface EditCorrespondentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCorrespondentPage({
  params,
}: EditCorrespondentPageProps) {
  await requireAdminPage();

  const { id } = await params;
  const correspondentId = Number(id);

  if (!Number.isSafeInteger(correspondentId) || correspondentId <= 0) {
    notFound();
  }

  const correspondent = await prisma.correspondent.findUnique({
    where: {
      id: correspondentId,
    },
  });

  if (!correspondent) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link
          href="/admin/correspondents"
          className="font-semibold text-emerald-700 hover:text-emerald-900"
        >
          ← Back to Correspondents
        </Link>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
          Edit Correspondent
        </h1>

        <p className="mt-2 text-slate-600">
          Update the profile and publication settings for this correspondent.
        </p>
      </div>

      <EditCorrespondentForm correspondent={correspondent} />
    </div>
  );
}
