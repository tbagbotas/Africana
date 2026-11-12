
"use client";

import { useCallback, useEffect, useState } from "react";

type Guest = {
  id: number;
  name: string;
  email?: string | null;
  createdAt?: string;
  inviteToken?: string;
};

type Interview = {
  id: number;
  title: string;
  roomName: string;
  status: string;
  createdAt: string;
  guests: Guest[];
};

export default function JitsiInterviewsClient() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [activeInterview, setActiveInterview] =
    useState<Interview | null>(null);

  const [title, setTitle] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [endingId, setEndingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadInterviews = useCallback(async () => {
    setLoadingHistory(true);

    try {
      const response = await fetch("/api/jitsi-interviews", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to load interviews.");
        return;
      }

      setInterviews(data.interviews || []);
      setError("");
    } catch {
      setError("Network error while loading interviews.");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInterviews();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadInterviews]);

  async function startInterview() {
    setError("");
    setNotice("");
    setInviteUrl("");

    if (!title.trim() || !guestName.trim()) {
      setError("Enter an interview title and guest name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/jitsi-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not create the interview.");
        return;
      }

      const interview = data.interview as Interview;
      const guest = interview.guests?.[0];

      setActiveInterview(interview);
      setTitle("");
      setGuestName("");
      setGuestEmail("");

      if (guest?.inviteToken) {
        const url = new URL(
          "/live-interview/jitsi-guest",
          window.location.origin,
        );
        url.searchParams.set("invite", guest.inviteToken);
        setInviteUrl(url.toString());
      } else {
        setError(
          "The interview was created, but no invitation token was returned.",
        );
      }

      setNotice("Interview created successfully.");
      await loadInterviews();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyInvitation() {
    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice("Invitation link copied successfully.");
      setError("");
    } catch {
      setError(
        "Could not copy automatically. Select the invitation link and copy it manually.",
      );
    }
  }

  function shareInvitationOnWhatsApp() {
    if (!inviteUrl) return;

    const message =
      "You are invited to an AFRICANA TV interview.\n\n" +
      "Please open this invitation link to join:\n" +
      inviteUrl +
      "\n\nWe look forward to speaking with you.";

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function makeInviteUrl(guest: Guest) {
    if (!guest.inviteToken) {
      setError(
        "This invitation token is unavailable. Create a new interview to generate a new invitation.",
      );
      setNotice("");
      return;
    }

    const url = new URL(
      "/live-interview/jitsi-guest",
      window.location.origin,
    );

    url.searchParams.set("invite", guest.inviteToken);
    setInviteUrl(url.toString());
    setError("");
    setNotice(`Invitation link prepared for ${guest.name}.`);
  }

  async function endInterview(interview: Interview) {
    if (interview.status === "ENDED") return;

    const confirmed = window.confirm(
      `Mark "${interview.title}" as ended? This does not forcibly disconnect participants from the public Jitsi room.`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");
    setEndingId(interview.id);

    try {
      const response = await fetch("/api/jitsi-interviews/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: interview.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not end the interview.");
        return;
      }

      setInterviews((current) =>
        current.map((item) =>
          item.id === interview.id
            ? { ...item, status: "ENDED" }
            : item,
        ),
      );

      setActiveInterview((current) =>
        current?.id === interview.id
          ? { ...current, status: "ENDED" }
          : current,
      );

      setInviteUrl("");
      setNotice(`"${interview.title}" has been marked as ended.`);
      await loadInterviews();
    } catch {
      setError("Network error while ending the interview.");
    } finally {
      setEndingId(null);
    }
  }

  const sectionStyle = {
    padding: "20px",
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "12px",
    marginBottom: "24px",
  } as const;

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0b1220",
    color: "#ffffff",
    marginTop: "6px",
  };

  const buttonStyle = {
    padding: "11px 16px",
    borderRadius: "8px",
    border: "1px solid #475569",
    cursor: "pointer",
    fontWeight: 600,
  } as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1220",
        color: "white",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>
        AFRICANA TV — Jitsi Interview Studio
      </h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Create interviews, invite guests, and manage your interview history.
      </p>

      {error && (
        <p
          role="alert"
          style={{
            color: "#fca5a5",
            background: "#451a1a",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          style={{
            color: "#86efac",
            background: "#052e16",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          {notice}
        </p>
      )}

      <section style={sectionStyle}>
        <h2 style={{ fontSize: "22px", marginTop: 0 }}>
          Create a new interview
        </h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void startInterview();
          }}
        >
          <label htmlFor="interview-title">Interview title</label>
          <input
            id="interview-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Youth Forum"
            maxLength={200}
            required
            style={inputStyle}
          />

          <label
            htmlFor="guest-name"
            style={{ display: "block", marginTop: "16px" }}
          >
            Guest name
          </label>
          <input
            id="guest-name"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            placeholder="Enter the guest's name"
            maxLength={200}
            required
            style={inputStyle}
          />

          <label
            htmlFor="guest-email"
            style={{ display: "block", marginTop: "16px" }}
          >
            Guest email (optional)
          </label>
          <input
            id="guest-email"
            type="email"
            value={guestEmail}
            onChange={(event) => setGuestEmail(event.target.value)}
            placeholder="guest@example.com"
            maxLength={320}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              marginTop: "18px",
              background: loading ? "#475569" : "#166534",
              color: "white",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating interview..." : "Create interview"}
          </button>
        </form>
      </section>

      {inviteUrl && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "22px", marginTop: 0 }}>
            Guest invitation
          </h2>
          <p style={{ color: "#cbd5e1" }}>
            Send this private invitation link to the guest. Anyone who has
            the link may be able to join while the interview remains active.
          </p>

          <input
            aria-label="Guest invitation URL"
            readOnly
            value={inviteUrl}
            onFocus={(event) => event.currentTarget.select()}
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "14px",
            }}
          >
            <button
              type="button"
              onClick={() => void copyInvitation()}
              style={{
                ...buttonStyle,
                background: "#1d4ed8",
                color: "white",
              }}
            >
              Copy invitation link
            </button>

            <button
              type="button"
              onClick={shareInvitationOnWhatsApp}
              style={{
                ...buttonStyle,
                background: "#15803d",
                color: "white",
              }}
            >
              Share on WhatsApp
            </button>
          </div>
        </section>
      )}

      {activeInterview && (
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Recently created</h2>
          <p>
            <strong>{activeInterview.title}</strong>
          </p>
          <p style={{ color: "#cbd5e1" }}>
            Status: {activeInterview.status}
          </p>
        </section>
      )}

      <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2 style={{ fontSize: "22px", margin: 0 }}>
            Interview history
          </h2>

          <button
            type="button"
            onClick={() => void loadInterviews()}
            disabled={loadingHistory}
            style={{
              ...buttonStyle,
              background: "#1e293b",
              color: "white",
            }}
          >
            {loadingHistory ? "Refreshing..." : "Refresh history"}
          </button>
        </div>

        {loadingHistory && interviews.length === 0 && (
          <p style={{ color: "#cbd5e1" }}>Loading interviews...</p>
        )}

        {!loadingHistory && interviews.length === 0 && (
          <p style={{ color: "#cbd5e1" }}>
            No interviews found. Create your first interview above.
          </p>
        )}

        <div style={{ display: "grid", gap: "16px", marginTop: "18px" }}>
          {interviews.map((interview) => (
            <article
              key={interview.id}
              style={{
                padding: "16px",
                border: "1px solid #334155",
                borderRadius: "10px",
                background: "#0b1220",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>
                    {interview.title}
                  </h3>
                  <p style={{ margin: "4px 0", color: "#cbd5e1" }}>
                    Status: {interview.status}
                  </p>
                  <p style={{ margin: "4px 0", color: "#94a3b8" }}>
                    Created:{" "}
                    {new Date(interview.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background:
                      interview.status === "ENDED" ? "#374151" : "#14532d",
                    color: "#ffffff",
                  }}
                >
                  {interview.status}
                </span>
              </div>

              <div style={{ marginTop: "14px" }}>
                <h4 style={{ marginBottom: "8px" }}>Guests</h4>

                {interview.guests?.length ? (
                  <ul style={{ paddingLeft: "20px" }}>
                    {interview.guests.map((guest) => (
                      <li key={guest.id} style={{ marginBottom: "8px" }}>
                        <span>{guest.name}</span>
                        {guest.email && (
                          <span style={{ color: "#94a3b8" }}>
                            {" "}
                            — {guest.email}
                          </span>
                        )}

                        {guest.inviteToken &&
                          interview.status !== "ENDED" && (
                            <button
                              type="button"
                              onClick={() => makeInviteUrl(guest)}
                              style={{
                                ...buttonStyle,
                                padding: "5px 9px",
                                marginLeft: "10px",
                                background: "#1e293b",
                                color: "white",
                              }}
                            >
                              Prepare invitation
                            </button>
                          )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#94a3b8" }}>
                    No guest details are available.
                  </p>
                )}
              </div>

              {interview.status !== "ENDED" && (
                <button
                  type="button"
                  onClick={() => void endInterview(interview)}
                  disabled={endingId === interview.id}
                  style={{
                    ...buttonStyle,
                    marginTop: "10px",
                    background: "#7f1d1d",
                    color: "white",
                    opacity: endingId === interview.id ? 0.7 : 1,
                  }}
                >
                  {endingId === interview.id
                    ? "Ending interview..."
                    : "Mark interview as ended"}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
