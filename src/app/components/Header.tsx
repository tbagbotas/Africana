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

const featureItems = [
  { href: "/latest", label: "Latest News" },
  { href: "/trending", label: "Trending" },
  { href: "/videos", label: "Videos" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/live", label: "Live TV" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/Africananewstv",
    label: "Facebook",
    className:
      "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500",
  },
  {
    href: "https://youtube.com/@africanatvnigeria?si=xRVHki4HFeGS0i2r",
    label: "YouTube",
    className:
      "rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-500",
  },
  {
    href: "https://x.com/tbagbotas?s=11",
    label: "X",
    className:
      "rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700",
  },
  {
    href: "https://www.tiktok.com/",
    label: "TikTok",
    className:
      "rounded-md bg-black px-4 py-2 text-sm font-semibold transition hover:bg-gray-800",
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    className:
      "rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold transition hover:bg-pink-500",
  },
  {
    href: "https://www.threads.net/",
    label: "Threads",
    className:
      "rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold transition hover:bg-gray-800",
  },
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
                  if (e.key === "Enter") handleSearch();
                }}
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-yellow-400 sm:w-64"
              />
              <button
                type="button"
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
              Login
            </Link>

            {/* Live TV */}
            <Link
              href="/live"
              className="inline-flex items-center gap-2 rounded-md border border-yellow-400 bg-emerald-700 px-3 py-2 font-semibold text-white transition hover:bg-emerald-600"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              Live TV
            </Link>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" onClick={closeMenu}>
            <img
              src="/africana-tv-header.svg"
              alt="AFRICANA TV"
              className="h-auto w-[260px] sm:w-[400px] lg:w-[520px]"
            />
          </Link>

          {/* Desktop Social */}
          <div className="hidden items-center gap-2 lg:flex">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={social.className}
              >
                {social.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-emerald-500 bg-emerald-800 px-3 py-2 text-2xl text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "X" : "☰"}
          </button>
        </div>

        {/* Mobile Social */}
        {menuOpen && (
          <div className="border-t border-gray-200 px-4 pb-4 lg:hidden">
            <div className="flex flex-wrap gap-2 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={social.className.replace("px-4", "px-3")}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden border-t border-emerald-700 bg-emerald-800 text-white lg:block">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ul className="flex flex-wrap items-center gap-1 py-3 font-semibold">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

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

            {/* Features Menu */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm transition ${
                  featureItems.some(
                    (item) =>
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                  )
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-emerald-700 hover:text-yellow-300"
                }`}
                aria-expanded={featuresOpen}
              >
                Features
                <span
                  className={`text-xs transition-transform ${
                    featuresOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {featuresOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-lg border border-emerald-600 bg-white shadow-xl">
                  {featureItems.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setFeaturesOpen(false)}
                        className={`block px-4 py-3 text-sm font-semibold transition ${
                          active
                            ? "bg-yellow-400 text-black"
                            : "text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>
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
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`));

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

              {/* Mobile Features */}
              <li>
                <button
                  type="button"
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="flex w-full items-center justify-between rounded-lg bg-emerald-700 px-4 py-3 font-semibold transition hover:bg-emerald-600"
                >
                  <span>Features</span>
                  <span
                    className={`text-xs transition-transform ${
                      featuresOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {featuresOpen && (
                  <div className="mt-2 space-y-1 rounded-lg bg-emerald-950 p-2">
                    {featureItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className="block rounded-md px-4 py-3 text-sm font-medium transition hover:bg-emerald-800 hover:text-yellow-300"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}