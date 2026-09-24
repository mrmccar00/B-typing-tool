import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "cp_admin_session";

function getSecret(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

export function getAdminPathSlug(): string | undefined {
  const slug = process.env.ADMIN_PATH_SLUG?.trim();
  return slug ? slug : undefined;
}

/**
 * The admin/export feature is only considered "configured" when both a
 * password AND a secret URL path are set. Missing either disables the
 * feature entirely (404 on the page, 401 on export) rather than falling
 * back to a guessable default.
 */
export function isAdminConfigured(): boolean {
  return Boolean(getSecret()) && Boolean(getAdminPathSlug());
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

export function isValidPathSlug(candidate: string): boolean {
  const slug = getAdminPathSlug();
  if (!slug) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(slug);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !isAdminConfigured()) return false;
  const expected = signSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
