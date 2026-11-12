import crypto from "crypto";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function getSecret() {
  if (!SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return SESSION_SECRET;
}

function createSignature(userId: string, expiresAt: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${userId}.${expiresAt}`)
    .digest("hex");
}

export function createAdminSession(userId: number) {
  const id = String(userId);
  const expiresAt = String(
    Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS
  );

  const signature = createSignature(id, expiresAt);

  return `${id}.${expiresAt}.${signature}`;
}

export function verifyAdminSession(value: string) {
  const parts = value.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [userId, expiresAt, signature] = parts;

  if (
    !userId ||
    !expiresAt ||
    !signature ||
    !/^\d+$/.test(userId) ||
    !/^\d+$/.test(expiresAt) ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return null;
  }

  const expiry = Number(expiresAt);
  const now = Math.floor(Date.now() / 1000);

  if (
    !Number.isSafeInteger(expiry) ||
    expiry <= now ||
    expiry > now + SESSION_MAX_AGE_SECONDS
  ) {
    return null;
  }

  const expectedSignature = createSignature(userId, expiresAt);

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  return Number(userId);
}