import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Logo } from "./components/Logo";

const manrope = Manrope({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FastListing — Branded listing videos in 24 hours",
  description: "Send your listing photos. I'll deliver branded 16:9 and 9:16 videos in 24 hours. Done-for-you real estate video editing.",
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
            <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <Logo height={26} />
            </Link>
            <Link href="/#packages" className="text-subtle">Packages</Link>
            <Link href="/#how-it-works" className="text-subtle">How it works</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Link href="/intake" className="btn-primary" style={{ fontSize: 14, padding: "8px 14px" }}>
              Start a project
            </Link>
          </div>
        </nav>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
