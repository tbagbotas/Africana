
import Link from "next/link";
import CorrespondentForm from "../CorrespondentForm";
import { requireAdminPage } from "@/lib/require-admin-page";

export default async function NewCorrespondentPage() {
  await requireAdminPage();

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
          Add Correspondent
        </h1>

        <p className="mt-2 text-slate-600">
          Create a profile for an Africana TV correspondent or field reporter.
        </p>
      </div>

      <CorrespondentForm />
    </div>
  );
}
