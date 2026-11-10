import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Corrections Policy | AFRICANA",
  description:
    "How to report a possible error and how AFRICANA reviews and publishes corrections.",
};

export default function CorrectionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100">
      <section className="bg-emerald-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">AFRICANA newsroom</p>
          <h1 className="mt-3 text-4xl font-extrabold">Corrections Policy</h1>
          <p className="mt-4 max-w-3xl text-emerald-100">We correct material errors promptly and make meaningful changes clear to readers.</p>
        </div>
      </section>
      <article className="mx-auto max-w-4xl space-y-8 px-4 py-12 leading-7 text-gray-700 sm:px-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Report a possible error</h2>
          <p className="mt-3">Email <a className="font-semibold text-emerald-800 underline" href="mailto:contact@africana.news">contact@africana.news</a> with the article link, the passage in question, what you believe is incorrect, and any supporting source or documentation. You may also use our <a className="font-semibold text-emerald-800 underline" href="/contact">contact page</a>. Please include contact details in case an editor needs clarification.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Editorial review</h2>
          <p className="mt-3">An editor reviews the claim against the published story and available evidence. We may contact the reporter, relevant sources, or the person who raised the concern. We assess factual accuracy and context; a disagreement with an accurately reported fact or clearly labeled opinion is not by itself an error.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900">How corrections are published</h2>
          <p className="mt-3">When we confirm a material error, we correct the story as promptly as practical. We add a clear correction note to the article describing what changed. Minor fixes that do not alter meaning, such as typographical errors, may be corrected without a separate note. We do not silently change material facts.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Correction log</h2>
          <p className="mt-3">Correction notes remain attached to the affected article so readers can see the change and its context. If an article is substantially updated, we identify that update in the story where appropriate.</p>
        </section>
      </article>
      </main>
      <Footer />
    </>
  );
}
