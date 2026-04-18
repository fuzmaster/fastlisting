'use client'

import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Upload your photos',
    description: 'Drop in 15–30 finished listing stills. JPEGs, wide-angle, aerial — all supported.',
  },
  {
    number: '02',
    title: 'Set your brand',
    description: 'Select a saved brand preset with your agent name, brokerage, and colors. Or create one in seconds.',
  },
  {
    number: '03',
    title: 'Generate and download',
    description: 'Click Generate. Both 16:9 and 9:16 MP4s render in minutes. Download and deliver.',
  },
  {
    number: '04',
    title: 'Download and deliver',
    description: 'Two polished MP4s appear. 16:9 for MLS and email. 9:16 for Instagram Reels and TikTok. Done.',
  },
]

const features = [
  { icon: '⚡', title: 'Minutes, not hours', description: 'No timeline. No keyframes. No Premiere Pro. Upload, click, done.' },
  { icon: '🎯', title: 'Built for real estate', description: 'Focal-point cropping for wide-angle and aerial shots. Never a bad frame.' },
  { icon: '🎨', title: 'Saved brand presets', description: 'One preset per agent or brokerage. Apply instantly on every project.' },
  { icon: '📐', title: '16:9 and 9:16', description: 'MLS-ready landscape and social-ready vertical. Both generated in one click.' },
  { icon: '🎵', title: 'Licensed audio', description: 'Pre-cleared music tracks. No copyright issues on Instagram or YouTube.' },
  { icon: '🔒', title: 'Secure uploads', description: 'Photos go directly to encrypted S3 storage. Never stored on our servers.' },
]

export default function HomePage() {
  const demoVideoSrc = ''

  function trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return

    const w = window as Window & {
      dataLayer?: unknown[]
      gtag?: (...args: unknown[]) => void
    }

    w.dataLayer?.push({ event: eventName, ...properties, ts: Date.now() })
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, properties)
    }
  }

  return (
    <main style={{ backgroundColor: '#0A0A0A', color: '#F5F5F5', fontFamily: 'var(--font-geist-sans), sans-serif' }}>

      {/* HERO */}
      <section style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: 20, fontSize: 12, color: '#E8D5B7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>
          Built for real estate media professionals
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24, maxWidth: 800 }}>
          Stop editing timelines. Turn listing photos into branded videos in minutes.
        </h1>
        <p style={{ fontSize: 18, color: '#888888', maxWidth: 820, lineHeight: 1.7, marginBottom: 40 }}>
          Upload your photos. Set your brand. Get 16:9 and 9:16 MP4s ready to deliver — no timeline, no Premiere, no CapCut.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/login" onClick={() => trackEvent('homepage_primary_cta_click', { cta: 'generate_first_video_free' })} style={{ padding: '13px 32px', backgroundColor: '#E8D5B7', color: '#0A0A0A', borderRadius: 6, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Generate Your First Video Free
          </Link>
          <Link href="/pricing" onClick={() => trackEvent('homepage_secondary_cta_click', { cta: 'see_pricing' })} style={{ padding: '13px 32px', backgroundColor: 'transparent', color: '#F5F5F5', border: '1px solid #262626', borderRadius: 6, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
            See Pricing
          </Link>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: '#555' }}>No credit card required · Cancel anytime · Renders in minutes</p>

        <div style={{ width: '100%', maxWidth: 800, marginTop: 40, border: '1px solid #262626', borderRadius: 8, overflow: 'hidden', position: 'relative', backgroundColor: '#111' }}>
          {/* TODO: replace src with demo video URL */}
          <video src={demoVideoSrc} autoPlay muted loop playsInline style={{ width: '100%', display: 'block', aspectRatio: '16 / 9', backgroundColor: '#111' }} />
          {!demoVideoSrc && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888888', fontSize: 14 }}>
              Sample video coming soon
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section style={{ backgroundColor: '#141414', borderTop: '1px solid #262626', borderBottom: '1px solid #262626', padding: '20px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#E8D5B7', marginBottom: 6 }}>2–4 min</p>
            <p style={{ fontSize: 12, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Average render time</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#E8D5B7', marginBottom: 6 }}>16:9 + 9:16</p>
            <p style={{ fontSize: 12, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Both formats, one click</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#E8D5B7', marginBottom: 6 }}>30 photos</p>
            <p style={{ fontSize: 12, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Max photos per project</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Four steps to a finished video</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2 }}>
          {steps.map((step) => (
            <div key={step.number} style={{ padding: '40px 32px', backgroundColor: '#141414', border: '1px solid #262626' }}>
              <div style={{ fontSize: 12, color: '#E8D5B7', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 16 }}>{step.number}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.01em' }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#888888', lineHeight: 1.6 }}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 12 }}>Features</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Everything you need. Nothing you don&apos;t.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {features.map((f) => (
            <div key={f.title} style={{ padding: '28px 24px', backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8 }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#888888', lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 12 }}>WHAT PROFESSIONALS SAY</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Trusted by real estate media teams</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div style={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, padding: '28px 24px' }}>
            <p style={{ fontStyle: 'italic', fontSize: 14, color: '#F5F5F5', lineHeight: 1.7, marginBottom: 20 }}>
              I was spending 45 minutes per listing in Premiere. FastListing cut that to under 5. The output looks better than what I was producing manually.
            </p>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Sarah M.</p>
            <p style={{ fontSize: 12, color: '#888888' }}>Real Estate Photographer, Austin TX</p>
          </div>
          <div style={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, padding: '28px 24px' }}>
            <p style={{ fontStyle: 'italic', fontSize: 14, color: '#F5F5F5', lineHeight: 1.7, marginBottom: 20 }}>
              My clients started asking how I was producing vertical videos so fast. I didn&apos;t tell them it was one click.
            </p>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>James K.</p>
            <p style={{ fontSize: 12, color: '#888888' }}>Media Agency Owner, Miami FL</p>
          </div>
          <div style={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, padding: '28px 24px' }}>
            <p style={{ fontStyle: 'italic', fontSize: 14, color: '#F5F5F5', lineHeight: 1.7, marginBottom: 20 }}>
              The brand preset feature alone is worth it. I have 12 agents. I set their presets once and never think about it again.
            </p>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Rachel T.</p>
            <p style={{ fontSize: 12, color: '#888888' }}>Boutique Media Studio, Denver CO</p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#555', textAlign: 'center', marginTop: 16 }}>* Testimonials from beta users during early access period.</p>
      </section>

      {/* VS SECTION */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 12 }}>Why FastListing</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Built for volume. Not for hobbyists.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <div style={{ padding: '32px', backgroundColor: '#141414', border: '1px solid #262626' }}>
            <p style={{ fontSize: 13, color: '#888888', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Other tools</p>
            {['Build a timeline for every listing', 'Export one format at a time', 'Generic transitions and effects', 'Start from scratch every project', 'Risk copyright strikes on music'].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ color: '#EF4444', marginTop: 2, flexShrink: 0 }}>✕</span>
                <span style={{ fontSize: 14, color: '#888888' }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '32px', backgroundColor: '#141414', border: '1px solid #E8D5B7' }}>
            <p style={{ fontSize: 13, color: '#E8D5B7', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>FastListing</p>
            {['Upload and generate — no timeline', '16:9 and 9:16 in one click', 'Premium motion built for real estate', 'Saved brand presets per agent', 'Licensed audio included'].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ color: '#86EFAC', marginTop: 2, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: '#F5F5F5' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY CALLOUT */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, padding: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: '#E8D5B7', fontSize: 11, letterSpacing: '0.1em', marginBottom: 10 }}>ENTERPRISE-GRADE SECURITY</p>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Your listing photos are safe.</h2>
            <p style={{ fontSize: 14, color: '#888888', lineHeight: 1.6, maxWidth: 440 }}>
              Photos upload directly to encrypted AWS S3 storage. They never touch our app servers. Your client data stays yours.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ padding: '8px 16px', border: '1px solid #262626', borderRadius: 6, fontSize: 12, color: '#888888' }}>🔒 AWS S3 Encrypted</span>
            <span style={{ padding: '8px 16px', border: '1px solid #262626', borderRadius: 6, fontSize: 12, color: '#888888' }}>💳 Stripe Payments</span>
            <span style={{ padding: '8px 16px', border: '1px solid #262626', borderRadius: 6, fontSize: 12, color: '#888888' }}>🔑 Google Auth</span>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 40px', backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 12 }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to deliver your first listing video today?
          </h2>
          <p style={{ color: '#888888', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
            Join the real estate media professionals who stopped building timelines and started delivering faster.
          </p>
          <Link href="/login" onClick={() => trackEvent('homepage_bottom_cta_click', { cta: 'start_free_no_credit_card' })} style={{ display: 'inline-block', padding: '13px 32px', backgroundColor: '#E8D5B7', color: '#0A0A0A', borderRadius: 6, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Start Free — No Credit Card
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #262626', padding: '40px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>FastListing</p>
            <p style={{ fontSize: 12, color: '#555' }}>© {new Date().getFullYear()} FastListing. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/pricing" style={{ fontSize: 13, color: '#888888', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/privacy" style={{ fontSize: 13, color: '#888888', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: 13, color: '#888888', textDecoration: 'none' }}>Terms of Service</Link>
            <a href="mailto:support@fastlisting.app" style={{ fontSize: 13, color: '#888888', textDecoration: 'none' }}>Support</a>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#555' }}>Secured by</span>
            <span style={{ fontSize: 12, color: '#888888', padding: '3px 8px', border: '1px solid #262626', borderRadius: 4 }}>AWS</span>
            <span style={{ fontSize: 12, color: '#888888', padding: '3px 8px', border: '1px solid #262626', borderRadius: 4 }}>Stripe</span>
          </div>
        </div>
      </footer>

    </main>
  )
}
