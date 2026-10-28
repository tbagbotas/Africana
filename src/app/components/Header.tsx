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
  { href: "/videos", label: "Videos" },
  { href: "/podcasts", label: "Podcasts" },
];

export default function Header() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
            >
              Facebook
            </button>

            <button
              type="button"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-500"
            >
              YouTube
            </button>

            <button
              type="button"
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700"
            >
              X
            </button>

            <button
              type="button"
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700"
            >
              TikTok
            </button>

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
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold"
              >
                Facebook
              </button>

              <button
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold"
              >
                YouTube
              </button>

              <button
                type="button"
                className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold"
              >
                X
              </button>

              <button
                type="button"
                className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold"
              >
                TikTok
              </button>

            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden border-t border-emerald-700 bg-emerald-800 text-white lg:block">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ul className="flex flex-wrap gap-1 py-3 font-semibold">

            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      active
                        ? "bg-yellow-400 text-black"
                        : "hover:bg-emerald-700 hover:text-yellow-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-emerald-700 bg-emerald-800 text-white lg:hidden">
          <div className="px-4 py-4">

            <ul className="space-y-2">

              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`block rounded-lg px-4 py-3 font-semibold transition ${
                        active
                          ? "bg-yellow-400 text-black"
                          : "bg-emerald-700 hover:bg-emerald-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}

            </ul>

          </div>
        </nav>
      )}

    </header>
  );
}