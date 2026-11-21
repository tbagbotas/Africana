"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function GuestRoom() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roomData, setRoomData] = useState<{ roomName: string; guestName: string } | null>(null);

  useEffect(() => {
    if (!inviteToken) {
      setError("Invalid link. No invitation token provided.");
      setLoading(false);
      return;
    }

    // CORRECTED URL: Added /invite
    fetch(`/api/jitsi-interviews/invite?token=${inviteToken}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired invitation link.");
        return res.json();
      })
      .then((data) => {
        // CORRECTED DATA PARSING: The API returns { interview: {...}, guest: {...} }
        if (data.interview && data.interview.roomName) {
          setRoomData({
            roomName: data.interview.roomName,
            guestName: data.guest?.name || "Guest",
          });
        } else {
          throw new Error("Room details not found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [inviteToken]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-xl font-semibold animate-pulse">Connecting to Africana Studio...</p>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">Connection Error</h1>
          <p className="text-lg">{error || "Could not load the interview room."}</p>
          <p className="mt-4 text-gray-400">Please ask the host to send you a new invite link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <div className="flex items-center justify-between bg-gray-950 px-4 py-3 text-white shadow-md">
        <h1 className="text-lg font-bold">Africana Live Interview</h1>
        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold animate-pulse">LIVE</span>
      </div>
      <iframe
        src={`https://meet.jit.si/${roomData.roomName}#userInfo.displayName=%22${encodeURIComponent(roomData.guestName)}%22`}
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