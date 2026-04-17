import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FastListing",
  description: "Real estate videos in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body style={{ margin: 0, backgroundColor: '#0A0A0A', color: '#F5F5F5' }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '0 24px',
          height: 56,
          borderBottom: '1px solid #262626',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#0A0A0A',
        }}>
          <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F5', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link href="/brand-presets" style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F5', textDecoration: 'none' }}>
            Brand Presets
          </Link>
          <Link href="/pricing" style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F5', textDecoration: 'none' }}>
            Pricing
          </Link>
        </nav>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
