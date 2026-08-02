"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: number;
}

export default function DeleteButton({ id }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteArticle() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    setDeleting(true);

    const response = await fetch("/api/articles/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    setDeleting(false);

    if (response.ok) {
      alert("Article deleted successfully!");
      router.refresh();
    } else {
      const error = await response.text();
      alert(error);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteArticle}
      disabled={deleting}
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}