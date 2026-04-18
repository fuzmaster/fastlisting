import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FastListing — Real Estate Video Automation",
  description: "Turn listing photos into branded 16:9 and 9:16 videos in minutes. Built for real estate media professionals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, backgroundColor: '#0A0A0A', color: '#F5F5F5' }}>
        <nav style={{
          height: 56,
          borderBottom: '1px solid #262626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0A0A',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: 15, color: '#F5F5F5', letterSpacing: '-0.01em', textDecoration: 'none' }}>
              FastListing
            </Link>
            <Link href="/pricing" style={{ fontSize: 14, color: '#888888', textDecoration: 'none' }}>Pricing</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/dashboard" style={{ fontSize: 14, color: '#888888', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/login" style={{ fontSize: 14, color: '#888888', textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href="/login" style={{ fontSize: 14, color: '#0A0A0A', backgroundColor: '#E8D5B7', padding: '6px 16px', borderRadius: 6, fontWeight: 600, textDecoration: 'none' }}>
              Try Free
            </Link>
          </div>
        </nav>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
