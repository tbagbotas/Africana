import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | AFRICANA",
  description:
    "Privacy Policy for AFRICANA, Africa's Global News Network.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-emerald-900 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
            PRIVACY
          </span>

          <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-emerald-100">
            How AFRICANA handles information provided through our website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <article className="rounded-2xl bg-white p-6 shadow-lg sm:p-10">
          <p className="text-sm text-gray-500">
            Last updated: August 2026
          </p>

          <div className="mt-8 space-y-8 text-gray-700 leading-7">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Introduction
              </h2>

              <p className="mt-3">
                AFRICANA, Africa&apos;s Global News Network, respects your
                privacy. This Privacy Policy explains how information may be
                collected and used when you visit or interact with the
                AFRICANA website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                2. Information You Provide
              </h2>

              <p className="mt-3">
                You may voluntarily provide information when using features
                such as our contact form or newsletter subscription.
              </p>

              <p className="mt-3">
                This may include your name, email address, subject, and the
                contents of a message you send to us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                3. How We Use Information
              </h2>

              <p className="mt-3">
                Information provided to AFRICANA may be used to respond to
                inquiries, provide requested services, communicate with
                subscribers, and improve our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Newsletter
              </h2>

              <p className="mt-3">
                If you subscribe to the AFRICANA newsletter, your email
                address may be used to send news updates, headlines, and
                other communications related to AFRICANA.
              </p>

              <p className="mt-3">
                You should be able to unsubscribe from newsletter
                communications at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                5. Cookies and Analytics
              </h2>

              <p className="mt-3">
                AFRICANA may use cookies or similar technologies in the
                future to support website functionality, understand website
                usage, and improve the user experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                6. Third-Party Services
              </h2>

              <p className="mt-3">
                AFRICANA may use third-party services for functions such as
                website hosting, image delivery, analytics, email delivery,
                authentication, or other technical services.
              </p>

              <p className="mt-3">
                These services may process information according to their own
                privacy policies and applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                7. Data Security
              </h2>

              <p className="mt-3">
                We take reasonable measures to protect information handled
                through the website. However, no internet transmission or
                electronic storage system can be guaranteed to be completely
                secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                8. Your Rights
              </h2>

              <p className="mt-3">
                Depending on where you live and applicable law, you may have
                rights concerning your personal information, including rights
                to access, correct, delete, or restrict certain processing of
                your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Children&apos;s Privacy
              </h2>

              <p className="mt-3">
                AFRICANA is not intended to knowingly collect personal
                information from children without appropriate authorization.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                10. Changes to This Policy
              </h2>

              <p className="mt-3">
                We may update this Privacy Policy as AFRICANA&apos;s website,
                services, or legal requirements change. Updated versions will
                be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                11. Contact Us
              </h2>

              <p className="mt-3">
                If you have questions about this Privacy Policy or how
                AFRICANA handles information, please contact us.
              </p>

              <Link
                href="/contact"
                className="mt-4 inline-block font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Contact AFRICANA →
              </Link>
            </section>
          </div>
        </article>

        <div className="mt-8 text-center">
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