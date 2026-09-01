import Link from "next/link";

const categories = [
  { href: "/category/africa", label: "Africa" },
  { href: "/category/business", label: "Business" },
  { href: "/category/politics", label: "Politics" },
  { href: "/category/technology", label: "Technology" },
  { href: "/category/sports", label: "Sports" },
  { href: "/category/world", label: "World" },
  { href: "/category/entertainment", label: "Entertainment" },
  { href: "/category/climate", label: "Climate" },
];

const quickLinks = [
  { href: "/latest", label: "Latest News" },
  { href: "/trending", label: "Trending" },
  { href: "/videos", label: "Videos" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/live", label: "Live TV" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-extrabold tracking-wide text-white transition hover:text-yellow-400">
                AFRICANA
              </h2>
            </Link>

            <p className="mt-3 text-sm font-medium text-yellow-400">
              Africa • Stories • World
            </p>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              Africa&apos;s Global News Network bringing you the latest
              stories, breaking news, business, politics, technology,
              entertainment, sports, and more.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="#"
                aria-label="Africana on Facebook"
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
              >
                Facebook
              </a>

              <a
                href="#"
                aria-label="Africana on YouTube"
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
              >
                YouTube
              </a>

              <a
                href="#"
                aria-label="Africana on X"
                className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
              >
                X
              </a>

              <a
                href="#"
                aria-label="Africana on TikTok"
                className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-white">
              Categories
            </h3>

            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-sm transition hover:text-yellow-400"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-yellow-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Africana */}
          <div>
            <h3 className="text-lg font-bold text-white">
              Africana
            </h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-yellow-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
          <p>© 2026 Africana. All rights reserved.</p>

          <p>Africa&apos;s Global News Network</p>
        </div>
      </div>
    </footer>
  );
}