import Link from "next/link";

export const metadata = {
  title: "Terms of Service | AFRICANA",
  description:
    "Terms of Service for AFRICANA, Africa's Global News Network.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-emerald-900 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
            TERMS
          </span>

          <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 text-emerald-100">
            Terms governing your use of the AFRICANA website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <article className="rounded-2xl bg-white p-6 shadow-lg sm:p-10">
          <p className="text-sm text-gray-500">
            Last updated: August 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Acceptance of Terms
              </h2>

              <p className="mt-3">
                By accessing or using the AFRICANA website, you agree to
                these Terms of Service. If you do not agree with these terms,
                please do not use the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                2. About AFRICANA
              </h2>

              <p className="mt-3">
                AFRICANA is Africa&apos;s Global News Network. The website
                provides news, stories, information, videos, podcasts, and
                other content relating to Africa and the wider world.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Website Content
              </h2>

              <p className="mt-3">
                Content published on AFRICANA is provided for general
                informational and editorial purposes.
              </p>

              <p className="mt-3">
                While we aim to provide accurate and useful information, we
                do not guarantee that every piece of content will always be
                complete, accurate, current, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Intellectual Property
              </h2>

              <p className="mt-3">
                Unless otherwise stated, AFRICANA&apos;s website design,
                branding, original text, graphics, and other original
                materials are protected by applicable intellectual property
                laws.
              </p>

              <p className="mt-3">
                You may not reproduce, redistribute, modify, or commercially
                exploit AFRICANA content without appropriate permission,
                except where permitted by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                5. User Submissions
              </h2>

              <p className="mt-3">
                If you submit information through a contact form, news tip,
                or other feature, you are responsible for ensuring that the
                information you provide is lawful and does not infringe the
                rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                6. Prohibited Use
              </h2>

              <p className="mt-3">
                You agree not to use the AFRICANA website for unlawful
                purposes, to interfere with website operation, to attempt
                unauthorized access, or to distribute harmful or malicious
                material.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                7. External Links
              </h2>

              <p className="mt-3">
                AFRICANA may contain links to third-party websites or
                services. We are not responsible for the content, policies,
                availability, or practices of third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                8. Availability of the Website
              </h2>

              <p className="mt-3">
                We may update, change, suspend, or temporarily discontinue
                parts of the website or its services without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Limitation of Liability
              </h2>

              <p className="mt-3">
                To the extent permitted by applicable law, AFRICANA will not
                be responsible for losses or damages arising from your use of
                or inability to use the website or its content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                10. Changes to These Terms
              </h2>

              <p className="mt-3">
                We may update these Terms of Service when necessary. Changes
                will be published on this page, and the updated date will be
                changed accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                11. Contact Us
              </h2>

              <p className="mt-3">
                If you have questions about these Terms of Service, please
                contact the AFRICANA team.
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