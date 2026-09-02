export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

import MessageActions from "./MessageActions";
import AdminNav from "../components/AdminNav";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalMessages = messages.length;

  const unreadMessages = messages.filter(
    (message) => !message.read
  ).length;

  const readMessages = messages.filter(
    (message) => message.read
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 lg:flex">
      {/* Admin Navigation */}
      <AdminNav unreadMessages={unreadMessages} />

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold">
              Contact Messages
            </h1>

            <p className="mt-2 text-gray-600">
              Messages received through the AFRICANA contact form.
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-500">
                Total Messages
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {totalMessages}
              </h2>
            </div>

            <div className="rounded-xl bg-red-50 p-6 shadow">
              <p className="text-red-700">
                Unread
              </p>

              <h2 className="mt-2 text-4xl font-bold text-red-700">
                {unreadMessages}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-6 shadow">
              <p className="text-green-700">
                Read
              </p>

              <h2 className="mt-2 text-4xl font-bold text-green-700">
                {readMessages}
              </h2>
            </div>

          </div>

          {/* Messages */}
          {messages.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow">

              <div className="text-5xl">
                📭
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                No messages yet
              </h2>

              <p className="mt-2 text-gray-600">
                Messages submitted through the contact form will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-6">

              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`rounded-2xl bg-white p-6 shadow-lg ${
                    !message.read
                      ? "border-l-4 border-red-500"
                      : ""
                  }`}
                >

                  <div className="flex flex-col gap-5">

                    {/* Status */}
                    <div className="flex flex-wrap items-center gap-3">

                      {!message.read ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          NEW
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          READ
                        </span>
                      )}

                      <span className="text-sm text-gray-500">
                        {new Date(
                          message.createdAt
                        ).toLocaleString()}
                      </span>

                    </div>

                    {/* Subject */}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {message.subject}
                    </h2>

                    {/* Sender */}
                    <div className="space-y-1 text-sm">

                      <p>
                        <span className="font-semibold">
                          From:
                        </span>{" "}
                        {message.name}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Email:
                        </span>{" "}

                        <a
                          href={`mailto:${message.email}`}
                          className="text-emerald-700 hover:underline"
                        >
                          {message.email}
                        </a>
                      </p>

                    </div>

                    {/* Message */}
                    <div className="rounded-xl bg-gray-50 p-5">

                      <p className="whitespace-pre-wrap leading-7 text-gray-700">
                        {message.message}
                      </p>

                    </div>

                    {/* Actions */}
                    <div>
                      <MessageActions
                        id={message.id}
                        read={message.read}
                        email={message.email}
                        subject={message.subject}
                      />
                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>
      </div>
    </main>
  );
}