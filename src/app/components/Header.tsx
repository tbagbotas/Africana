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
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      alert("Please enter something to search.");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center px-6 py-3 gap-4">
          <span className="text-sm">
            🌍 Africa's Global News Network
          </span>

          <div className="flex items-center gap-2 flex-wrap">
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
              className="w-64 px-3 py-2 bg-white border border-gray-300 rounded-md text-black outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button
              onClick={handleSearch}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md transition"
            >
              Search
            </button>

            <button className="hover:text-yellow-400 transition">
              👤 Login
            </button>

            <button className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md font-semibold transition">
              🔴 Live TV
            </button>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-center">
          <div>
            <Link href="/">
              <h1 className="text-5xl font-extrabold tracking-wide hover:text-yellow-400 transition cursor-pointer">
                AFRICANA
              </h1>
            </Link>

            <p className="text-yellow-400 mt-2">
              Africa • Stories • World
            </p>
          </div>

          <div className="flex gap-3 mt-5 lg:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
              Facebook
            </button>

            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition">
              YouTube
            </button>

            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition">
              X
            </button>

            <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded transition">
              TikTok
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-emerald-800 text-white border-t border-emerald-700">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex flex-wrap gap-2 py-4 font-semibold">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded transition ${
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
    </header>
  );
}