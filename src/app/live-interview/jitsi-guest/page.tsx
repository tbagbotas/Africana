"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GuestRoom() {
  const searchParams = useSearchParams();
  const room = searchParams.get("room") || "";
  const name = searchParams.get("name") || "Guest";

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Invalid link. No room provided.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <div className="flex items-center justify-between bg-gray-950 px-4 py-3 text-white">
        <h1 className="text-lg font-bold">Africana Live Interview</h1>
        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold">LIVE</span>
      </div>
      <iframe
        src={`https://meet.jit.si/${room}#userInfo.displayName=%22${encodeURIComponent(name)}%22`}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="h-full w-full border-0"
        title="Jitsi Interview"
      />
    </div>
  );
}

export default function JitsiGuestPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>}>
      <GuestRoom />
    </Suspense>
  );
}