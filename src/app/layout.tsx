import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Onzio — Digital platforms for soccer clubs",
  description: "Onzio designs, builds, and manages modern digital homes for ambitious soccer clubs.",
  openGraph: {
    title: "Onzio — Digital platforms for soccer clubs",
    description: "Modern digital homes for ambitious soccer clubs.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#f7f8fa" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
