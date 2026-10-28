"use client";

import { useTransition } from "react";
import {
  deleteMessage,
  markMessageAsRead,
  markMessageAsUnread,
} from "./actions/message-actions";

interface MessageActionsProps {
  id: number;
  read: boolean;
  email: string;
  subject: string;
}

export default function MessageActions({
  id,
  read,
  email,
  subject,
}: MessageActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleRead() {
    startTransition(async () => {
      await markMessageAsRead(id);
    });
  }

  function handleUnread() {
    startTransition(async () => {
      await markMessageAsUnread(id);
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteMessage(id);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`mailto:${email}?subject=${encodeURIComponent(
          `Re: ${subject}`
        )}`}
        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        ✉️ Reply
      </a>

      {read ? (
        <button
          type="button"
          onClick={handleUnread}
          disabled={isPending}
          className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Mark Unread"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleRead}
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Mark Read"}
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}