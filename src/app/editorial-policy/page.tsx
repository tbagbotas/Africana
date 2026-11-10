import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Editorial Policy | AFRICANA",
  description:
    "How AFRICANA reports, verifies, and labels news and editorial content.",
};

const sections = [
  {
    title: "Sourcing and verification",
    paragraphs: [
      "We seek information from identifiable, relevant sources and verify important claims against documents, direct accounts, or independent sources where practical. We distinguish confirmed facts from allegations, projections, and analysis, and provide context so readers can assess what is known.",
      "When reporting is based on a public statement, court filing, research paper, or other primary material, we identify that source in the story when possible. We do not knowingly publish fabricated quotations or materially misleading images.",
    ],
  },
  {
    title: "Editorial independence",
    paragraphs: [
      "Editorial decisions are made in the interests of accurate, fair reporting. Sources, advertisers, sponsors, and other outside parties do not receive authority to dictate our coverage or conclusions. We aim to disclose material conflicts that could affect a story.",
    ],
  },
  {
    title: "AI use",
    paragraphs: [
      "Editorial responsibility remains with AFRICANA journalists and editors. If an AI tool is used to create or materially alter published text, images, audio, or video, we will disclose that use in or alongside the relevant content. AI output is not treated as a source and must be checked by a human editor before publication.",
    ],
  },
  {
    title: "Sponsored content",
    paragraphs: [
      "Paid placements, partnerships, and other sponsored material must be clearly labeled so readers can distinguish them from independent editorial coverage. Payment does not guarantee favorable editorial coverage.",
    ],
  },
  {
    title: "News, analysis, and opinion",
    paragraphs: [
      "Straight news aims to report verified facts in a fair and direct way. Analysis explains evidence, context, or likely implications. Opinion expresses a contributor's viewpoint. We label opinion and sponsored material clearly and identify the author where applicable.",
    ],
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100">
      <section className="bg-emerald-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
            AFRICANA newsroom
          </p>
          <h1 className="mt-3 text-4xl font-extrabold">Editorial Policy</h1>
          <p className="mt-4 max-w-3xl text-emerald-100">
            The standards that guide how we report, present, and label our journalism.
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-4xl space-y-8 px-4 py-12 leading-7 text-gray-700 sm:px-6">
        <p>AFRICANA works to provide accurate, fair, and clearly presented reporting about Africa and the world. Editors are responsible for applying these standards to published work.</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p className="mt-3" key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        <p>Readers can raise a concern or suggest a correction through our <a className="font-semibold text-emerald-800 underline" href="/contact">contact page</a>.</p>
      </article>
      </main>
      <Footer />
    </>
  );
}
