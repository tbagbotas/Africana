"use client";

import { FormEvent, useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setMessage(data.message);
      setEmail("");
    } catch (error) {
      console.error("Newsletter request error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-emerald-700 py-14 text-white sm:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
          NEWSLETTER
        </span>

        <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
          Subscribe to Africana
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-50 sm:text-lg">
          Get breaking news, exclusive reports, and daily headlines delivered
          straight to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            aria-label="Email address"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isSubmitting}
            className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm font-semibold text-yellow-300">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm font-semibold text-red-200">
            {error}
          </p>
        )}

        <p className="mt-4 text-xs text-emerald-100">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}