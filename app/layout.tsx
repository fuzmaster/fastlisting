import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const manrope = Manrope({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FastListing — Real Estate Video Automation",
  description: "Turn listing photos into branded 16:9 and 9:16 videos in minutes. Built for real estate media professionals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body style={{ margin: 0 }}>
        <nav
          style={{
            minHeight: 68,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            position: "sticky",
            top: 0,
            backgroundColor: "rgba(248,245,239,0.92)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/" style={{ fontWeight: 800, fontSize: 19, fontFamily: "var(--font-geist-mono)", letterSpacing: "-0.02em" }}>
              FastListing
            </Link>
            <Link href="/pricing" className="text-subtle">Pricing</Link>
            <Link href="/security" className="text-subtle">Security</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Link href="/dashboard" className="text-subtle">Dashboard</Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize: 14, padding: "8px 14px" }}>
              Sign in
            </Link>
            <Link href="/login" className="btn-primary" style={{ fontSize: 14, padding: "8px 14px" }}>
              Start Free Trial
            </Link>
          </div>
        </nav>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
