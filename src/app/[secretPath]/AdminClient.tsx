"use client";

import { useEffect, useState } from "react";

export default function AdminClient() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin-auth")
      .then((res) => res.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Incorrect password.");
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    setAuthenticated(false);
    setPassword("");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-brand-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Survey Results Admin</h1>

      {!authenticated ? (
        <form
          onSubmit={handleLogin}
          className="w-full rounded-2xl bg-white p-6 shadow-lg"
        >
          <label className="mb-2 block text-sm font-medium text-brand-700">
            Admin password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-xl border-2 border-brand-200 px-4 py-2 focus:border-brand-500 focus:outline-none"
            autoFocus
          />
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full rounded-full bg-brand-600 px-6 py-2 font-semibold text-white shadow hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Checking..." : "Log in"}
          </button>
        </form>
      ) : (
        <div className="w-full rounded-2xl bg-white p-6 shadow-lg">
          <p className="mb-4 text-brand-700">
            You&rsquo;re logged in. Export all survey responses (raw answers, assigned
            segment, self-selected segment, and probability breakdown) as a CSV file.
          </p>
          <a
            href="/api/export"
            className="mb-3 block rounded-full bg-brand-600 px-6 py-2 text-center font-semibold text-white shadow hover:bg-brand-700"
          >
            Download CSV
          </a>
          <button
            onClick={handleLogout}
            className="w-full rounded-full border-2 border-brand-200 px-6 py-2 font-semibold text-brand-700 hover:bg-brand-50"
          >
            Log out
          </button>
        </div>
      )}
    </main>
  );
}
