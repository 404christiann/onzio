import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Onzio — A better digital home for your soccer club";
const description =
  "A professional soccer club website and simple tools for managing content, rosters, schedules, match stats, and programs.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onziofutbol.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: "Onzio",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = { themeColor: "#f6f6f8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
