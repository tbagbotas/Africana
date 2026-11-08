"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/category/africa", label: "Africa" },
  { href: "/category/business", label: "Business" },
  { href: "/category/politics", label: "Politics" },
  { href: "/category/technology", label: "Technology" },
  { href: "/category/sports", label: "Sports" },
  { href: "/category/world", label: "World" },
  { href: "/category/entertainment", label: "Entertainment" },
  { href: "/category/climate", label: "Climate" },
  { href: "/correspondents", label: "Correspondents" },
];

export default function Header() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      alert("Please enter something to search.");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setFeaturesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">

      {/* Top Bar */}
      <div className="bg-gray-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between">

          <span className="text-sm font-medium">
            Africa&apos;s Global News Network
          </span>

          <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:w-auto">

            {/* Search */}
            <div className="flex w-full max-w-md gap-2 sm:w-auto">
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-yellow-400 sm:w-64"
              />

              <button
                onClick={handleSearch}
                className="rounded-md bg-yellow-500 px-4 py-2 font-semibold text-black transition hover:bg-yellow-400"
              >
                Search
              </button>
            </div>

            {/* Login */}
            <Link
              href="/admin/login"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 font-semibold transition hover:bg-gray-800 hover:text-yellow-400"
            >
              👤 Login
            </Link>

            {/* Live TV */}
            <Link
              href="/live"
              className="rounded-md border border-yellow-400 bg-emerald-700 px-3 py-2 font-semibold text-white transition hover:bg-emerald-600"
            >
              📺 Live TV
            </Link>

          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-emerald-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">

          {/* Logo */}
          <div>
            <Link href="/" onClick={closeMenu}>
              <h1 className="cursor-pointer text-3xl font-extrabold tracking-wide transition hover:text-yellow-400 sm:text-5xl">
                AFRICANA
              </h1>
            </Link>

            <p className="mt-1 text-sm text-yellow-400 sm:mt-2 sm:text-base">
              Africa • Stories • World
            </p>
          </div>

          {/* Desktop Social */}
          <div className="hidden items-center gap-2 lg:flex">

            <button
              type="button"
              onClick={() => window.open("https://www.facebook.com/Africananewstv", "_blank", "noopener,noreferrer")} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
            >
              Facebook
            </button>

            <button
              type="button"
              onClick={() => window.open("https://youtube.com/@africanatvnigeria?si=xRVHki4HFeGS0i2r", "_blank", "noopener,noreferrer")}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-500"
            >
              YouTube
            </button>

            <button
              type="button"
              onClick={() => window.open("https://x.com/tbagbotas?s=11", "_blank", "noopener,noreferrer")}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700"
            >
              X
            </button>

            <button
              type="button"
              onClick={() => window.open("https://www.tiktok.com/", "_blank", "noopener,noreferrer")}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700"
            >
              TikTok
            </button>

<button
  type="button"
  onClick={() => window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")}
  className="rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold transition hover:bg-pink-500"
>
  Instagram
</button>

            <button type="button" onClick={() => window.open("https://www.threads.net/", "_blank", "noopener,noreferrer")} className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold">Threads</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-emerald-500 bg-emerald-800 px-3 py-2 text-2xl transition hover:bg-emerald-700 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Social */}
        {menuOpen && (
          <div className="border-t border-emerald-800 px-4 pb-4 lg:hidden">
            <div className="flex flex-wrap gap-2 pt-4">

              <button
                type="button"
                onClick={() => window.open("https://www.facebook.com/Africananewstv", "_blank", "noopener,noreferrer")} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold"
              >
                Facebook
              </button>

              <button
                type="button"
              onClick={() => window.open("https://youtube.com/@africanatvnigeria?si=xRVHki4HFeGS0i2r", "_blank", "noopener,noreferrer")}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold"
              >
                YouTube
              </button>

              <button
                type="button"
              onClick={() => window.open("https://x.com/tbagbotas?s=11", "_blank", "noopener,noreferrer")}
                className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold"
              >
                X
              </button>

              <button
                type="button"
              onClick={() => window.open("https://www.tiktok.com/", "_blank", "noopener,noreferrer")}
                className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold"
              >
                TikTok
              </button>

<button
  type="button"
  onClick={() => window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")}
  className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold"
>
  Instagram
</button>

              <button type="button" onClick={() => window.open("https://www.threads.net/", "_blank", "noopener,noreferrer")} className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold">Threads</button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden border-t border-emerald-700 bg-emerald-800 text-white lg:block"><div className="mx-auto max-w-7xl px-4 md:px-6"><ul className="flex flex-wrap items-center gap-1 py-3 font-semibold">
        {navItems.map((item) => { const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/")); return <li key={item.href}><Link href={item.href} className={active ? "block rounded-md bg-yellow-400 px-3 py-2 text-sm text-black" : "block rounded-md px-3 py-2 text-sm hover:bg-emerald-700 hover:text-yellow-300"}>{item.label}</Link></li>; })}
        <li className="relative"><button type="button" aria-expanded={featuresOpen} onClick={() => setFeaturesOpen(!featuresOpen)} className="rounded-md px-3 py-2 text-sm hover:bg-emerald-700 hover:text-yellow-300">Features ▼</button>{featuresOpen && <div className="absolute left-0 top-full z-50 min-w-48 rounded-lg bg-white p-2 text-gray-900 shadow-xl">{[["/latest","Latest News"],["/trending","Trending"],["/videos","Videos"],["/podcasts","Podcasts"],["/live","Live TV"]].map(([href,label]) => <Link key={href} href={href} onClick={() => setFeaturesOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-800">{label}</Link>)}</div>}</li>
      </ul></div></nav>
      {/* Mobile Navigation */}
      {menuOpen && <nav className="border-t border-emerald-700 bg-emerald-800 text-white lg:hidden"><div className="px-4 py-4"><ul className="space-y-2">
        {navItems.map((item) => { const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/")); return <li key={item.href}><Link href={item.href} onClick={closeMenu} className={active ? "block rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-black" : "block rounded-lg bg-emerald-700 px-4 py-3 font-semibold hover:bg-emerald-600"}>{item.label}</Link></li>; })}
        <li><button type="button" aria-expanded={featuresOpen} onClick={() => setFeaturesOpen(!featuresOpen)} className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-left font-semibold">Features {featuresOpen ? "▲" : "▼"}</button>{featuresOpen && <ul className="mt-1 space-y-1 pl-4">{[["/latest","Latest News"],["/trending","Trending"],["/videos","Videos"],["/podcasts","Podcasts"],["/live","Live TV"]].map(([href,label]) => <li key={href}><Link href={href} onClick={closeMenu} className="block rounded-lg px-4 py-2 text-sm hover:bg-emerald-600">{label}</Link></li>)}</ul>}</li>
      </ul></div></nav>}

    </header>
  );
}
