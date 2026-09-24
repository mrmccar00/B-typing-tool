import { notFound } from "next/navigation";
import { isAdminConfigured, isValidPathSlug } from "@/lib/adminAuth";
import AdminClient from "./AdminClient";

// This route is intentionally not linked from anywhere in the app. It's
// only reachable by knowing the exact secret path set via ADMIN_PATH_SLUG.
// Any other value (or a missing ADMIN_PATH_SLUG/ADMIN_PASSWORD) 404s
// exactly like a real unmatched route, revealing nothing.
export default async function SecretAdminPage({
  params,
}: {
  params: Promise<{ secretPath: string }>;
}) {
  const { secretPath } = await params;

  if (!isAdminConfigured() || !isValidPathSlug(secretPath)) {
    notFound();
  }

  return <AdminClient />;
}
