import Header from "../components/Header";
import Footer from "../components/Footer";

const donationMethods = [
  {
    title: "Donate with Stripe",
    description: "Make a secure donation using Stripe. You will be taken to Stripe's secure payment page.",
    label: "Donate with Stripe",
    href: "https://buy.stripe.com/00weVfd7NeTMcyoejq7AI00",
  },
  {
    title: "Support us on GoFundMe",
    description: "Support Africana TV through our GoFundMe fundraiser.",
    label: "Support us on GoFundMe",
    href: "https://gofund.me/853f21961",
  },
];

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Support Africana TV</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">Support Independent African Journalism</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">Your support helps Africana TV continue producing independent journalism, video reports, live broadcasts and stories from Africa and around the world.</p>
        </header>
        <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
          <div className="flex gap-4">
            <span className="text-2xl" aria-hidden="true">📰</span>
            <div>
              <h2 className="text-xl font-bold text-gray-950">Why your support matters</h2>
              <p className="mt-3 leading-7 text-gray-600">Africana TV is committed to bringing audiences reliable news, analysis and stories that highlight Africa's people, businesses, communities and opportunities.</p>
              <p className="mt-3 leading-7 text-gray-600">Donations help support journalism, reporting, technology, video production and the continued development of our digital news platform.</p>
              <p className="mt-3 font-semibold text-gray-800">Every contribution helps us continue our work.</p>
            </div>
          </div>
        </section>
        <section className="mt-10">
          <div className="mb-6 text-center">
            <p className="text-2xl" aria-hidden="true">💳</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-950">Support Africana TV</h2>
            <p className="mt-2 text-gray-600">Choose your preferred donation method below.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {donationMethods.map((method) => (
              <article key={method.title} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-bold text-gray-950">{method.title}</h3>
                <p className="mt-2 flex-1 leading-6 text-gray-600">{method.description}</p>
                <a href={method.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex justify-center rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">{method.label} <span className="ml-2" aria-hidden="true">↗</span></a>
              </article>
            ))}
            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-lg font-bold text-gray-950">Nigerian Bank Transfer</h3>
              <p className="mt-2 leading-6 text-gray-600">Nigerian bank transfer is currently unavailable.</p>
              <p className="mt-2 leading-6 text-gray-600">Please use one of the international donation options above.</p>
            </article>
          </div>
        </section>
        <section className="mt-12 rounded-2xl bg-emerald-950 px-6 py-8 text-center text-white sm:px-10">
          <p className="text-3xl" aria-hidden="true">🌍</p>
          <h2 className="mt-3 text-xl font-bold">Thank you for supporting African journalism.</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-emerald-100">Your contribution helps us continue telling important stories and giving African voices a wider audience.</p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
