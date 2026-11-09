
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/require-admin-page";

export default async function CorrespondentsPage() {
  await requireAdminPage();

  const correspondents = await prisma.correspondent.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Correspondents
          </h1>
          <p className="mt-2 text-slate-600">
            Manage Africana TV correspondents and field reporters.
          </p>
        </div>

        <Link
          href="/admin/correspondents/new"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
        >
          + Add Correspondent
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {correspondents.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No correspondents yet
            </h2>
            <p className="mt-2 text-slate-600">
              Add your first Africana TV correspondent.
            </p>
            <Link
              href="/admin/correspondents/new"
              className="mt-6 inline-flex rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800"
            >
              Add Correspondent
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-950 text-left text-sm font-bold text-white">
                <tr>
                  <th className="px-6 py-4">Correspondent</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {correspondents.map((correspondent) => (
                  <tr
                    key={correspondent.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {correspondent.photo ? (
                          <img
                            src={correspondent.photo}
                            alt={correspondent.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-xl">
                            👤
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-slate-900">
                            {correspondent.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            /{correspondent.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {[correspondent.city, correspondent.country]
                        .filter(Boolean)
                        .join(", ") || "Not specified"}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {correspondent.specialization || "Not specified"}
                    </td>

                    <td className="px-6 py-5">
                      {correspondent.published ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/correspondents/edit/${correspondent.id}`}
                        className="font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
