"use client";

import { FormEvent, useEffect, useState } from "react";

export default function DonationSettingsPage() {
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [bankEnabled, setBankEnabled] = useState(false);

  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripePaymentLink, setStripePaymentLink] = useState("");

  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [paypalPaymentLink, setPaypalPaymentLink] = useState("");

  const [gofundmeEnabled, setGofundmeEnabled] = useState(false);
  const [gofundmeLink, setGofundmeLink] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/donation-settings");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to load donation settings."
          );
        }

        setBankName(data.settings.bankName || "");
        setAccountName(data.settings.accountName || "");
        setAccountNumber(data.settings.accountNumber || "");
        setBankEnabled(Boolean(data.settings.bankEnabled));

        setStripeEnabled(Boolean(data.settings.stripeEnabled));
        setStripePaymentLink(data.settings.stripePaymentLink || "");

        setPaypalEnabled(Boolean(data.settings.paypalEnabled));
        setPaypalPaymentLink(data.settings.paypalPaymentLink || "");

        setGofundmeEnabled(Boolean(data.settings.gofundmeEnabled));
        setGofundmeLink(data.settings.gofundmeLink || "");
      } catch (error) {
        console.error("Load donation settings error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load donation settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (bankEnabled) {
      if (
        !bankName.trim() ||
        !accountName.trim() ||
        !accountNumber.trim()
      ) {
        setError(
          "Please enter the bank name, account name and account number."
        );
        return;
      }
    }

    if (stripeEnabled && !stripePaymentLink.trim()) {
      setError(
        "Please enter the Stripe Payment Link or disable Stripe."
      );
      return;
    }

    if (paypalEnabled && !paypalPaymentLink.trim()) {
      setError(
        "Please enter the PayPal Payment Link or disable PayPal."
      );
      return;
    }

    if (gofundmeEnabled && !gofundmeLink.trim()) {
      setError(
        "Please enter the GoFundMe link or disable GoFundMe."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/donation-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bankName,
          accountName,
          accountNumber,
          bankEnabled,

          stripeEnabled,
          stripePaymentLink,

          paypalEnabled,
          paypalPaymentLink,

          gofundmeEnabled,
          gofundmeLink,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to save donation settings."
        );
      }

      setMessage("Donation settings saved successfully.");
    } catch (error) {
      console.error("Save donation settings error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save donation settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-slate-600">
              Loading donation settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Website Settings
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
            Donation Settings
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Manage the payment methods displayed on the public
            donation page.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="space-y-8">

            {/* BANK TRANSFER */}
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-slate-950">
                  Nigerian Bank Transfer
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Manage the Nigerian bank account displayed to
                  visitors.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="bankName"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    Bank Name
                  </label>

                  <input
                    id="bankName"
                    type="text"
                    value={bankName}
                    onChange={(event) =>
                      setBankName(event.target.value)
                    }
                    placeholder="e.g. Zenith Bank"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="accountName"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    Account Name
                  </label>

                  <input
                    id="accountName"
                    type="text"
                    value={accountName}
                    onChange={(event) =>
                      setAccountName(event.target.value)
                    }
                    placeholder="e.g. Africana TV"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    Account Number
                  </label>

                  <input
                    id="accountNumber"
                    type="text"
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(event) =>
                      setAccountNumber(event.target.value)
                    }
                    placeholder="e.g. 0123456789"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={bankEnabled}
                      onChange={(event) =>
                        setBankEnabled(event.target.checked)
                      }
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span>
                      <span className="block font-semibold text-slate-900">
                        Enable Nigerian Bank Transfer
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        When enabled, these bank details will be
                        displayed publicly on the Donate page.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* STRIPE */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-slate-950">
                  Stripe
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Use a Stripe Payment Link so visitors can donate
                  securely through Stripe.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="stripePaymentLink"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    Stripe Payment Link
                  </label>

                  <input
                    id="stripePaymentLink"
                    type="url"
                    value={stripePaymentLink}
                    onChange={(event) =>
                      setStripePaymentLink(event.target.value)
                    }
                    placeholder="https://buy.stripe.com/..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Paste the public Stripe Payment Link created in
                    your Stripe dashboard.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={stripeEnabled}
                      onChange={(event) =>
                        setStripeEnabled(event.target.checked)
                      }
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span>
                      <span className="block font-semibold text-slate-900">
                        Enable Stripe
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        When enabled, a Stripe donation button will
                        appear on the public Donate page.
                      </span>
                    </span>
                  </label>
                </div>

                {stripeEnabled && stripePaymentLink && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                    Stripe is configured with a Payment Link.
                  </div>
                )}
              </div>
            </section>

            {/* PAYPAL */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-slate-950">
                  PayPal
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Use a public PayPal donation/payment link so
                  visitors can donate through PayPal.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="paypalPaymentLink"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    PayPal Payment Link
                  </label>

                  <input
                    id="paypalPaymentLink"
                    type="url"
                    value={paypalPaymentLink}
                    onChange={(event) =>
                      setPaypalPaymentLink(event.target.value)
                    }
                    placeholder="https://www.paypal.com/..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Paste your public PayPal donation/payment link.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={paypalEnabled}
                      onChange={(event) =>
                        setPaypalEnabled(event.target.checked)
                      }
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span>
                      <span className="block font-semibold text-slate-900">
                        Enable PayPal
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        When enabled, a PayPal donation button will
                        appear on the public Donate page.
                      </span>
                    </span>
                  </label>
                </div>

                {paypalEnabled && paypalPaymentLink && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                    PayPal is configured with a payment link.
                  </div>
                )}
              </div>
            </section>

            {/* GOFUNDME */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-slate-950">
                  GoFundMe
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Add your public GoFundMe fundraiser so visitors
                  can support Africana TV.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="gofundmeLink"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    GoFundMe Link
                  </label>

                  <input
                    id="gofundmeLink"
                    type="url"
                    value={gofundmeLink}
                    onChange={(event) =>
                      setGofundmeLink(event.target.value)
                    }
                    placeholder="https://gofund.me/..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Paste the public GoFundMe fundraiser link.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={gofundmeEnabled}
                      onChange={(event) =>
                        setGofundmeEnabled(event.target.checked)
                      }
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span>
                      <span className="block font-semibold text-slate-900">
                        Enable GoFundMe
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        When enabled, a GoFundMe support button will
                        appear on the public Donate page.
                      </span>
                    </span>
                  </label>
                </div>

                {gofundmeEnabled && gofundmeLink && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                    GoFundMe is configured successfully.
                  </div>
                )}
              </div>
            </section>

            {!bankEnabled &&
              !stripeEnabled &&
              !paypalEnabled &&
              !gofundmeEnabled && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  All donation payment methods are currently
                  disabled.
                </div>
              )}

            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                {error}
              </div>
            )}

            <div className="flex justify-end border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}