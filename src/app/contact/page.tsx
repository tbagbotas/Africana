"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSending(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Something went wrong. Please try again."
        );
      }

      setSuccessMessage(
        "Your message has been sent successfully. Thank you for contacting Africana."
      );

      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-emerald-900 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
            CONTACT AFRICANA
          </span>

          <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">
            Get in Touch With Us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
            Have a news tip, story idea, business inquiry, or general
            question? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              For general questions, story tips, partnerships, or media
              inquiries, please contact the AFRICANA team.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <p className="font-semibold text-gray-900">
                  📧 Email
                </p>

                <p className="mt-1 text-gray-600">
                  contact@africana.news
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  📰 News Tips
                </p>

                <p className="mt-1 text-gray-600">
                  Send us information about important stories and
                  developments.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  🤝 Partnerships
                </p>

                <p className="mt-1 text-gray-600">
                  We welcome media, business, and community partnerships.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <p className="mt-2 text-gray-600">
              Fill in the form below and we&apos;ll get back to you.
            </p>

            {successMessage && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <p className="font-semibold">Message sent successfully!</p>
                <p className="mt-1 text-sm">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                <p className="font-semibold">Unable to send message</p>
                <p className="mt-1 text-sm">{errorMessage}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="What is your message about?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  required
                  placeholder="Write your message..."
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSending ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>

        {/* Back to News */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="font-semibold text-emerald-700 hover:text-emerald-900"
          >
            ← Back to Africana
          </Link>
        </div>
      </section>
    </main>
  );
}