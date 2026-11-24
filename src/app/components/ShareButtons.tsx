"use client";

import { useState } from "react";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: "bg-black hover:bg-gray-800" },
    { name: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, color: "bg-green-500 hover:bg-green-600" },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "bg-blue-700 hover:bg-blue-800" },
    { name: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, color: "bg-sky-500 hover:bg-sky-600" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Share this article</h3>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${link.color}`}
          >
            {link.name}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-300"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}