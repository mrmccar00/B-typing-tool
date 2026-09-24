import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "cp_admin_session";

function getSecret(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

export function isAdminConfigured(): boolean {
  return Boolean(getSecret());
}

export function checkPassword(password: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  // Constant-time comparison to avoid leaking password length/content via timing.
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function signSessionToken(): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured.");
  return crypto.createHmac("sha256", secret).update("cp-admin-session").digest("hex");
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !isAdminConfigured()) return false;
  const expected = signSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
