"use client";

import { useMemo, useState } from "react";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
}

interface NewsletterSubscribersProps {
  subscribers: Subscriber[];
}

export default function NewsletterSubscribers({
  subscribers: initialSubscribers,
}: NewsletterSubscribersProps) {
  const [subscribers, setSubscribers] =
    useState<Subscriber[]>(initialSubscribers);

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredSubscribers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return subscribers;
    }

    return subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(searchTerm)
    );
  }, [search, subscribers]);

  const handleDelete = async (id: number, email: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${email} from the newsletter subscribers?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/newsletter/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to delete subscriber.");
        return;
      }

      setSubscribers((current) =>
        current.filter((subscriber) => subscriber.id !== id)
      );

      setMessage(data.message || "Subscriber deleted successfully.");
    } catch (requestError) {
      console.error("Newsletter delete request error:", requestError);
      setError("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const latestSubscription =
    subscribers.length > 0
      ? new Date(subscribers[0].subscribedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "No subscribers yet";

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
            Africana Admin
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Newsletter Subscribers
          </h1>

          <p className="mt-2 text-gray-600">
            Manage people who have subscribed to the Africana newsletter.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">
              Total Subscribers
            </p>

            <p className="mt-2 text-4xl font-extrabold text-emerald-700">
              {subscribers.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">
              Latest Subscription
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {latestSubscription}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Subscribers
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredSubscribers.length}{" "}
                  {filteredSubscribers.length === 1
                    ? "subscriber"
                    : "subscribers"}{" "}
                  shown
                </p>
              </div>

              <div className="w-full sm:max-w-sm">
                <label htmlFor="subscriber-search" className="sr-only">
                  Search subscribers
                </label>

                <input
                  id="subscriber-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by email..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 sm:px-6">
              {message}
            </div>
          )}

          {error && (
            <div className="border-b border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 sm:px-6">
              {error}
            </div>
          )}

          {subscribers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl">📧</div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No subscribers yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Newsletter subscribers will appear here.
              </p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl">🔎</div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No matching subscribers
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try a different email address.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      #
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      Subscribed
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr
                      key={subscriber.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-500">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                        {subscriber.email}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          subscriber.subscribedAt
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              subscriber.id,
                              subscriber.email
                            )
                          }
                          disabled={deletingId === subscriber.id}
                          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === subscriber.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}