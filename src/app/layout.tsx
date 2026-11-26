import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Onzio — Club websites and admin for soccer clubs";
const description =
  "Onzio builds your soccer club's website and gives staff one admin for registration and payments, rosters, schedules and results, match video, and every page on the site.";
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
