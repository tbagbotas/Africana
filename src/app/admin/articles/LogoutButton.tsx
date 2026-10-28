"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}