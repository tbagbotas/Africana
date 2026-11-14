export type StreamingPlatform = {
  id: string;
  name: string;
  url: string;
  mark: string;
};

export const streamingUrls = {
  youtube: "",
  facebook: "",
  x: "",
  twitch: "",
  tiktok: "",
  instagram: "",
  linkedin: "",
};

export const streamingPlatforms: StreamingPlatform[] = [
  { id: "youtube", name: "YouTube", url: streamingUrls.youtube, mark: "▶" },
  { id: "facebook", name: "Facebook", url: streamingUrls.facebook, mark: "f" },
  { id: "x", name: "X", url: streamingUrls.x, mark: "𝕏" },
  { id: "twitch", name: "Twitch", url: streamingUrls.twitch, mark: "▣" },
  { id: "tiktok", name: "TikTok", url: streamingUrls.tiktok, mark: "♪" },
  { id: "instagram", name: "Instagram", url: streamingUrls.instagram, mark: "◎" },
  { id: "linkedin", name: "LinkedIn", url: streamingUrls.linkedin, mark: "in" },
];

export const availableStreamingPlatforms = streamingPlatforms.filter(
  (platform) => platform.url.trim().length > 0,
);
