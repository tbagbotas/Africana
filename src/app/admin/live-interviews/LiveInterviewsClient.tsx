"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useLocalParticipant,
  useTracks,
  ControlBar,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import type { TrackReference } from "@livekit/components-core";
import { useEffect, useState } from "react";

type InterviewGuest = {
  id: number;
  name: string;
  email: string | null;
  location: string | null;
  inviteToken: string;
};

type Interview = {
  id: number;
  title: string;
  guestName: string;
  guestEmail: string | null;
  guestLocation: string | null;
  interviewDate: string | null;
  roomName: string;
  inviteToken: string;
  guests?: InterviewGuest[];
};

function InterviewRoom({
  interview,
}: {
  interview: Interview;
}) {
  const tracks = useTracks([
    {
      source: Track.Source.Camera,
      withPlaceholder: false,
    },
  ]);

  const guestTracks = tracks.filter(
    (track): track is TrackReference => !!track.publication && track.participant.identity.startsWith("guest-") && track.source === Track.Source.Camera
  );

  const hostTrack = tracks.find((track): track is TrackReference => !!track.publication && !track.participant.identity.startsWith("guest-") && track.source === Track.Source.Camera);

  const { localParticipant } = useLocalParticipant();

  const [live, setLive] = useState(false);
  const [broadcastStartedAt, setBroadcastStartedAt] = useState<number | null>(null);
  const [broadcastElapsed, setBroadcastElapsed] = useState(0);

  useEffect(() => {
    if (!live || !broadcastStartedAt) {
      setBroadcastElapsed(0);
      return;
    }

    const timer = window.setInterval(() => {
      setBroadcastElapsed(
        Math.floor((Date.now() - broadcastStartedAt) / 1000)
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [live, broadcastStartedAt]);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [egressId, setEgressId] = useState("");
  const [voiceIsolationEnabled, setVoiceIsolationEnabled] = useState(true);
  const [selectedGuestIdentity, setSelectedGuestIdentity] = useState<string | null>(null);

  const selectedGuestTrack = guestTracks.find(
    (track) => track.participant.identity === selectedGuestIdentity
  );

  const selectedGuestIndex = selectedGuestTrack
    ? guestTracks.findIndex(
        (track) =>
          track.participant.identity === selectedGuestIdentity
      )
    : -1;

  const selectedGuest = interview.guests?.[selectedGuestIndex];

  const selectedGuestName =
    selectedGuestTrack?.participant.name ||
    selectedGuest?.name ||
    interview.guestName;

  const selectedGuestLocation =
    selectedGuest?.location ||
    interview.guestLocation ||
    "Location";

  const startBroadcast = async () => {
    if (!interview.roomName) {
      alert("This interview does not have a LiveKit room.");
      return;
    }

    setBroadcastLoading(true);

    try {
      const response = await fetch("/api/live-interviews/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: interview.roomName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start the broadcast.");
      }

      setEgressId(data.egressId || "");
      setBroadcastStartedAt(Date.now());
      setBroadcastElapsed(0);
      setLive(true);
    } catch (error) {
      console.error("AFRICANA BROADCAST ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to start the broadcast."
      );
    } finally {
      setBroadcastLoading(false);
    }
  };

  const endBroadcast = async () => {
    if (!egressId) {
      alert("No active broadcast was found.");
      return;
    }

    setBroadcastLoading(true);

    try {
      const response = await fetch(
        "/api/live-interviews/broadcast/end",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            egressId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to end the broadcast.");
      }

      setLive(false);
      setEgressId("");
      setBroadcastStartedAt(null);
      setBroadcastElapsed(0);
    } catch (error) {
      console.error("AFRICANA END BROADCAST ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to end the broadcast."
      );
    } finally {
      setBroadcastLoading(false);
    }
  };
  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(
      !localParticipant.isCameraEnabled
    );
  };

  const toggleMicrophone = async () => {
    await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  };

  const toggleVoiceIsolation = async () => {
    try {
      const publication = localParticipant.getTrackPublication(Track.Source.Microphone);
      const track = publication?.track;
      if (!track) { alert("Microphone is not available yet."); return; }
      const nextValue = !voiceIsolationEnabled;
      await track.mediaStreamTrack.applyConstraints({ voiceIsolation: nextValue } as MediaTrackConstraints);
      setVoiceIsolationEnabled(nextValue);
    } catch (error) {
      console.error("AFRICANA VOICE ISOLATION ERROR:", error);
      alert(error instanceof Error ? error.message : "Voice Isolation could not be changed.");
    }
  };
  return (
    <div className="mt-6">
      {/* PROGRAM PREVIEW */}
      {selectedGuestTrack && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Program
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Selected Guest
              </p>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Preview
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-emerald-500/40 bg-[#101815]">
            <VideoTrack
              trackRef={selectedGuestTrack}
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-4 left-4 rounded bg-black/80 px-4 py-2">
              <p className="text-sm font-bold">
                {selectedGuestName}
              </p>
              <p className="text-xs text-gray-400">
                {selectedGuestLocation} - Africana TV
              </p>
            </div>

            <div className="absolute right-4 top-4 rounded bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              PROGRAM
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {/* HOST */}
        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#101815]">
          {hostTrack ? (
            <VideoTrack
              trackRef={hostTrack}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Host camera loading...
            </div>
          )}

          <div className="absolute bottom-3 left-3 rounded bg-black/75 px-3 py-1 text-xs font-semibold">
            AFRICANA TV HOST
          </div>
        </div>

        {/* GUESTS */}
        {guestTracks.length > 0 ? (
          guestTracks.map((guestTrack, index) => (
            <div
              key={guestTrack.participant.identity}
              className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#101815]"
            >
              <VideoTrack
                trackRef={guestTrack}
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div className="rounded bg-black/75 px-3 py-1 text-xs font-semibold">
                  {guestTrack.participant.name ||
                    interview.guests?.[index]?.name ||
                    `GUEST ${index + 1}`}
                  {interview.guests?.[index]?.location
                    ? ` - ${interview.guests[index].location}`
                    : ""}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedGuestIdentity(guestTrack.participant.identity)
                  }
                  className={`rounded px-3 py-1.5 text-xs font-bold ${
                    selectedGuestIdentity === guestTrack.participant.identity
                      ? "bg-emerald-500 text-black"
                      : "bg-black/75 text-white hover:bg-white/20"
                  }`}
                >
                  {selectedGuestIdentity === guestTrack.participant.identity
                    ? "SELECTED"
                    : "SELECT"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#101815]">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl">
                </div>

                <p className="font-medium">
                  {interview.guestName}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Waiting for guest to join
                </p>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 rounded bg-black/75 px-3 py-1 text-xs font-semibold">
              {interview.guestName}
              {interview.guestLocation
                ? ` - ${interview.guestLocation}`
                : ""}
            </div>
          </div>
        )}
      </div>
      {/* PRODUCTION STATUS */}
      <div
        className={`mt-6 rounded-xl border p-4 transition-all ${
          live
            ? "border-red-500/40 bg-red-950/20"
            : "border-white/10 bg-black/20"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Production Status
            </p>

            <div className="mt-2 flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  live
                    ? "animate-pulse bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                    : "bg-gray-500"
                }`}
              />

              <div>
                <p
                  className={`text-lg font-black tracking-wide ${
                    live ? "text-red-400" : "text-white"
                  }`}
                >
                  {live ? "ON AIR" : "STANDBY"}
                </p>

                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-gray-500">
                  {live
                    ? "Broadcasting to Africana TV"
                    : "Ready for live broadcast"}
                </p>
              </div>
            </div>
          </div>

          {live && (
            <div className="rounded-lg border border-red-500/30 bg-black/30 px-4 py-2 text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-300">
                On Air Time
              </p>

              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-white">
                {String(Math.floor(broadcastElapsed / 3600)).padStart(2, "0")}:
                {String(
                  Math.floor((broadcastElapsed % 3600) / 60)
                ).padStart(2, "0")}:
                {String(broadcastElapsed % 60).padStart(2, "0")}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* CONTROLS */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={toggleMicrophone}
          className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
        >
           {localParticipant.isMicrophoneEnabled
            ? "Mute"
            : "Unmute"}
        </button>

        <button
          onClick={toggleCamera}
          className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
        >
           {localParticipant.isCameraEnabled
            ? "Camera Off"
            : "Camera On"}
        </button>

        <ControlBar
          controls={{
            microphone: false,
            camera: false,
            screenShare: true,
            leave: false,
          }}
        />

        <button
          type="button"
          onClick={toggleVoiceIsolation}
          className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
        >
          {voiceIsolationEnabled ? "Voice Isolation On" : "Voice Isolation Off"}
        </button>

        <button
          type="button"
          onClick={live ? endBroadcast : startBroadcast}
          disabled={broadcastLoading}
          className={`rounded-lg px-6 py-3 text-sm font-bold ${
            live
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-600 hover:bg-red-500"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          [LIVE]{" "}
          {broadcastLoading
            ? live
              ? "ENDING..."
              : "STARTING..."
            : live
              ? "END LIVE"
              : "TAKE LIVE"}
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          Interview Status
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              guestTracks.length > 0 ? "bg-green-500" : "bg-gray-600"
            }`}
          />

          <span className="text-sm font-semibold">
            {guestTracks.length > 0
              ? live
                ? "ON AIR"
                : "GUEST CONNECTED"
              : "WAITING FOR GUEST"}
          </span>
        </div>
      </div>

      {/* LOWER THIRD */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-gray-300">
          Lower Third
        </h3>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          <div className="border-l-4 border-emerald-500 bg-black/90 px-5 py-4">
            <p className="text-lg font-bold">
              {selectedGuestName}
            </p>

            <p className="text-sm text-gray-400">
              {selectedGuestLocation} - Africana TV
            </p>
          </div>
        </div>
      </div>
      <RoomAudioRenderer />
    </div>
  );
}

export default function LiveInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] =
    useState<Interview | null>(null);

  const [title, setTitle] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [location, setLocation] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [guests, setGuests] = useState([
    { name: "", email: "", location: "" },
  ]);

  const [creating, setCreating] = useState(false);

  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");

  const loadInterviews = async () => {
    try {
      const response = await fetch("/api/live-interviews");
      const data = await response.json();

      if (response.ok) {
        setInterviews(data);
      }
    } catch (error) {
      console.error("Failed to load interviews:", error);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  async function generateGuestLink() {
    const validGuests = guests.filter(
      (guest) =>
        guest.name.trim() ||
        guest.email.trim() ||
        guest.location.trim()
    );

    if (!title.trim() || validGuests.length === 0) {
      alert("Please enter the interview title and at least one guest.");
      return;
    }

    if (validGuests.some((guest) => !guest.name.trim())) {
      alert("Every guest must have a name.");
      return;
    }

    if (validGuests.length > 5) {
      alert("A maximum of 5 guests is allowed.");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/live-interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          guests: validGuests.map((guest) => ({
            name: guest.name.trim(),
            email: guest.email.trim() || null,
            location: guest.location.trim() || null,
          })),
          interviewDate: interviewDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create interview."
        );
      }

      const interview = data as Interview;

      setSelectedInterview(interview);

      setTitle("");
      setGuests([{ name: "", email: "", location: "" }]);
      setInterviewDate("");

      await loadInterviews();

      const guestLinks =
        interview.guests && interview.guests.length > 0
          ? interview.guests
              .map(
                (guest, index) =>
                  `Guest ${index + 1} - ${guest.name}\n${window.location.origin}/live-interview/guest?invite=${encodeURIComponent(
                    guest.inviteToken
                  )}`
              )
              .join("\n\n")
          : `Guest 1 - ${interview.guestName}\n${window.location.origin}/live-interview/guest?invite=${encodeURIComponent(
              interview.inviteToken
            )}`;

      await navigator.clipboard.writeText(guestLinks);

      alert(
        `Interview created. ${interview.guests?.length || 1} guest invitation link(s) have been copied to your clipboard.`
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not create the live interview."
      );
    } finally {
      setCreating(false);
    }
  }
  async function joinHostRoom(interview: Interview) {
    try {
      const participantIdentity =
        `host-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: interview.roomName,
          participantIdentity,
          participantName: "Africana TV Host",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to connect to LiveKit."
        );
      }

      setSelectedInterview(interview);
      setToken(data.participantToken);
      setServerUrl(data.serverUrl);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not connect to the interview."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#07130d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

              <span className="text-sm font-medium uppercase tracking-widest text-red-400">
                Africana TV
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Live Interviews
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Create and manage remote interviews with guests and
              correspondents anywhere in the world.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            INTERVIEW CONTROL ROOM
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* CREATE */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">
              Create Interview
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Invite a guest to join remotely using their phone,
              tablet, or computer.
            </p>

            <div className="mt-6 space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Interview title"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none focus:border-emerald-500"
              />

              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none focus:border-emerald-500"
              />

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Guests
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Add up to 5 remote guests.
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    {guests.length}/5
                  </span>
                </div>

                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {guests.map((guest, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                          Guest {index + 1}
                        </p>

                        {guests.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setGuests(
                                guests.filter(
                                  (_, guestIndex) =>
                                    guestIndex !== index
                                )
                              )
                            }
                            className="text-xs font-semibold text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          value={guest.name}
                          onChange={(e) =>
                            setGuests(
                              guests.map(
                                (item, guestIndex) =>
                                  guestIndex === index
                                    ? {
                                        ...item,
                                        name: e.target.value,
                                      }
                                    : item
                              )
                            )
                          }
                          placeholder="Guest name"
                          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                        />

                        <input
                          type="email"
                          value={guest.email}
                          onChange={(e) =>
                            setGuests(
                              guests.map(
                                (item, guestIndex) =>
                                  guestIndex === index
                                    ? {
                                        ...item,
                                        email: e.target.value,
                                      }
                                    : item
                              )
                            )
                          }
                          placeholder="Guest email"
                          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                        />

                        <input
                          value={guest.location}
                          onChange={(e) =>
                            setGuests(
                              guests.map(
                                (item, guestIndex) =>
                                  guestIndex === index
                                    ? {
                                        ...item,
                                        location: e.target.value,
                                      }
                                    : item
                              )
                            )
                          }
                          placeholder="Guest location"
                          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {guests.length < 5 && (
                  <button
                    type="button"
                    onClick={() =>
                      setGuests([
                        ...guests,
                        { name: "", email: "", location: "" },
                      ])
                    }
                    className="mt-3 w-full rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10"
                  >
                    + Add Guest
                  </button>
                )}
              </div>

              <button
                onClick={generateGuestLink}
                disabled={creating}
                className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500 disabled:opacity-50"
              >
                {creating ? "Generating..." : "Generate Guest Links"}
              </button>
            </div>
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold text-gray-300">
                Existing Interviews
              </h3>

              <div className="space-y-2">
                {interviews.map((interview) => (
                  <button
                    key={interview.id}
                    onClick={() =>
                      joinHostRoom(interview)
                    }
                    className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-left hover:bg-white/5"
                  >
                    <p className="font-medium">
                      {interview.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {interview.guestName}
                      {interview.guestLocation
                        ? ` - ${interview.guestLocation}`
                        : ""}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CONTROL ROOM */}
          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Broadcast Panel
                </h2>

                <p className="text-sm text-gray-500">
                  Remote interview production
                </p>
              </div>

              {selectedInterview && (
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                  {selectedInterview.title}
                </div>
              )}
            </div>

            {!token || !serverUrl || !selectedInterview ? (
              <div className="mt-8 flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-[#101815]">
                <div className="text-center">
                  <p className="font-semibold">
                    Select an interview
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Select an interview from the left to open the
                    control room.
                  </p>
                </div>
              </div>
            ) : (
              <LiveKitRoom
                token={token}
                serverUrl={serverUrl}
                connect={true}
                audio={true}
                video={true}
              >
                <InterviewRoom
                  interview={selectedInterview}
                />
              </LiveKitRoom>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}




























