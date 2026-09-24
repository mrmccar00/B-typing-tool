import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What's Your Renter Type? | Continental Properties",
  description: "A quick, fun quiz to discover your renter segment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-brand-900 antialiased">{children}</body>
    </html>
  );
}
