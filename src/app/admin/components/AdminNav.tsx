
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "../articles/LogoutButton";

interface AdminNavProps {
  unreadMessages: number;
}

export default function AdminNav({
  unreadMessages,
}: AdminNavProps) {
  const pathname = usePathname();

  const isArticles = pathname === "/admin/articles";
  const isNewArticle = pathname === "/admin/articles/new";
  const isMessages = pathname.startsWith("/admin/messages");
  const isCorrespondents = pathname.startsWith("/admin/correspondents");
  const isLiveInterviews =
  pathname === "/admin/live-interviews" ||
  pathname.startsWith("/admin/live-interviews/");

const isJitsiInterviews =
  pathname === "/admin/live-interviews-jitsi" ||
  pathname.startsWith("/admin/live-interviews-jitsi/");
  const isLiveTV = pathname === "/admin/live" || pathname.startsWith("/admin/live/");
  const isPodcasts = pathname.startsWith("/admin/podcasts");
  const isDonationSettings = pathname.startsWith(
    "/admin/donation-settings"
  );

  const linkClass = (active: boolean) =>
    `block rounded-lg px-3 py-3 font-semibold transition ${
      active
        ? "bg-emerald-700 text-white"
        : "hover:bg-slate-800"
    }`;

  return (
    <aside className="w-full bg-slate-950 text-white lg:min-h-screen lg:w-64">
      <div className="p-6">
        <Link
          href="/admin/articles"
          className="block text-2xl font-extrabold tracking-tight"
        >
          AFRICANA
        </Link>

        <p className="mt-1 text-sm text-slate-400">
          News CMS
        </p>
      </div>

      <nav className="px-4 pb-6">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Management
        </p>

        <div className="space-y-2">
          <Link href="/admin/articles" className={linkClass(isArticles)}>
            📰 Articles
          </Link>

          <Link
            href="/admin/articles/new"
            className={linkClass(isNewArticle)}
          >
            ➕ New Article
          </Link>

          <Link
            href="/admin/correspondents"
            className={linkClass(isCorrespondents)}
          >
            👤 Correspondents
          </Link>

          <Link
            href="/admin/messages"
            className={`flex items-center justify-between rounded-lg px-3 py-3 font-semibold transition ${
              isMessages
                ? "bg-emerald-700 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            <span>📩 Messages</span>

            {unreadMessages > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold">
                {unreadMessages}
              </span>
            )}
          </Link>

          <Link
            href="/admin/live"
            className={linkClass(isLiveTV)}
          >
            📺 Live TV
          </Link>

          <Link
            href="/admin/live-interviews"
            className={linkClass(isLiveInterviews)}
          >
            🎥 Live Guest Interviews
          </Link>
<Link
  href="/admin/live-interviews-jitsi"
  className={linkClass(isJitsiInterviews)}
>
  🎬 Jitsi Interview Studio
</Link>

          <Link
            href="/admin/podcasts"
            className={linkClass(isPodcasts)}
          >
            🎙️ Podcasts
          </Link>
        </div>

        <p className="mb-3 mt-8 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Website
        </p>

        <div className="space-y-2">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-3 font-semibold transition hover:bg-slate-800"
          >
            🌐 View Website
          </Link>

          <Link
            href="/admin/donation-settings"
            className={linkClass(isDonationSettings)}
          >
            💰 Donation Settings
          </Link>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Account
          </p>

          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}
