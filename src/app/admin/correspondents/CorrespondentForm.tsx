"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

export default function CorrespondentForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [photo, setPhoto] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter the correspondent's name.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/correspondents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          country,
          city,
          bio,
          specialization,
          email,
          website,
          socialLinks,
          photo,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save correspondent.");
      }

      alert("Correspondent saved successfully.");

      router.push("/admin/correspondents");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the correspondent.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Basic Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-slate-800">
              Full Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Amara Okafor"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              Country
            </label>

            <input
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder="e.g. Nigeria"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              City
            </label>

            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="e.g. Lagos"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-slate-800">
              Specialization
            </label>

            <input
              type="text"
              value={specialization}
              onChange={(event) => setSpecialization(event.target.value)}
              placeholder="e.g. Politics, Business, Technology"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-slate-800">
              Biography
            </label>

            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Write a short biography of the correspondent..."
              rows={7}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Contact & Social Media
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correspondent@example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              Website
            </label>

            <input
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              Social Media Links
            </label>

            <textarea
              value={socialLinks}
              onChange={(event) => setSocialLinks(event.target.value)}
              placeholder={"Instagram: https://instagram.com/username\nX: https://x.com/username\nFacebook: https://facebook.com/username"}
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-2 text-sm text-slate-500">
              You can add multiple social links, one per line.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ImageUpload
          image={photo}
          setImage={setPhoto}
        />

        <p className="mt-3 text-sm text-slate-500">
          Upload a professional photo of the correspondent. JPG, PNG or WebP.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Publication
        </h2>

        <label className="mt-6 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
          />

          <span className="font-semibold text-slate-800">
            Publish this correspondent profile
          </span>
        </label>

        <p className="mt-2 text-sm text-slate-500">
          Leave unchecked to save the correspondent as a draft.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/correspondents")}
          className="rounded-lg border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Correspondent"}
        </button>
      </div>
    </form>
  );
}