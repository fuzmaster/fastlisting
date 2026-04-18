'use client'

import Image from 'next/image'
import Link from 'next/link'

import styles from './page.module.css'

const steps = [
  {
    number: '01',
    title: 'Upload listing photos',
    description: 'Drop in up to 30 property photos. FastListing auto-detects pacing and scene order for a story-first cut.',
    image: '/images/workflow-upload.svg',
  },
  {
    number: '02',
    title: 'Apply your brand system',
    description: 'One click applies agent name, brokerage, colors, logo, and headshot so every video matches your team identity.',
    image: '/images/workflow-branding.svg',
  },
  {
    number: '03',
    title: 'Render with motion and transitions',
    description: 'AI sequencing and cinematic camera motion generate polished transitions with no manual keyframes.',
    image: '/images/workflow-render.svg',
  },
  {
    number: '04',
    title: 'Download both formats',
    description: 'Export 16:9 and 9:16 together in 2-4 minutes, then deliver instantly to MLS, Instagram, and TikTok.',
    image: '/images/workflow-download.svg',
  },
]

const features = [
  {
    title: 'AI photo sequencing',
    description: 'Automatically arranges scenes for a natural room-to-room flow so every listing feels intentional.',
  },
  {
    title: 'Automatic motion + transitions',
    description: 'Dynamic pans, zooms, and transition timing are generated per frame without timeline work.',
  },
  {
    title: 'Full branding control',
    description: 'Preset-based branding keeps every agent output consistent across high listing volume.',
  },
  {
    title: 'Licensed music included',
    description: 'Use pre-cleared tracks inside generated videos without copyright anxiety.',
  },
  {
    title: '2-4 minute delivery',
    description: 'Go from photos to two final files in minutes, compared with 2-8 hours in manual editors.',
  },
  {
    title: 'Built for real estate teams',
    description: 'Purpose-built for listing media workflows, not generic social templates.',
  },
]

const testimonials = [
  {
    quote:
      'FastListing replaced 6+ hours of weekly timeline editing for our team. We now deliver same-day branded videos for every listing shoot.',
    name: 'Sarah Morgan',
    title: 'Founder, Riverstone Media',
    image: '/images/avatar-sarah.svg',
  },
  {
    quote:
      'The AI sequencing gets room flow right, and the vertical cut is instantly usable. We stopped exporting separate versions manually.',
    name: 'James Kim',
    title: 'Creative Director, Coastline Studios',
    image: '/images/avatar-james.svg',
  },
  {
    quote:
      'Brand presets solved our biggest bottleneck. Twelve agents, one consistent look, and no hand-tuning each project anymore.',
    name: 'Rachel Torres',
    title: 'Producer, Summit Creative',
    image: '/images/avatar-rachel.svg',
  },
]

const logos = [
  '/images/logo-riverstone.svg',
  '/images/logo-coastline.svg',
  '/images/logo-summit.svg',
  '/images/logo-oakline.svg',
]

const demoVideoLandscape = 'https://samplelib.com/lib/preview/mp4/sample-20s.mp4'
const demoVideoVertical = 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4'

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <p className="eyebrow">Real Estate Video Automation</p>
              <h1 className={styles.heroTitle}>From listing photos to branded video in minutes, not hours.</h1>
              <p className={styles.heroSub}>
                FastListing is purpose-built for real estate media teams. Get AI sequencing, automatic motion effects,
                full branding control, licensed music, and two final aspect ratios in one render.
              </p>
              <div className={styles.ctaRow}>
                <Link href="/login" className="btn-primary">Start Free Trial (1 Render)</Link>
                <Link href="/pricing" className="btn-secondary">See Pricing</Link>
              </div>
              <p className={styles.trustRow}>No credit card required for trial. Privacy-first. 14-day refund guarantee on paid plans.</p>
            </div>

            <div className={styles.videoStack}>
              <div className={`${styles.videoCard} surface-card`}>
                <p className={styles.videoLabel}>Sample output: 16:9</p>
                <video className={styles.video} src={demoVideoLandscape} autoPlay muted loop playsInline controls />
              </div>
              <div className={`${styles.videoCard} surface-card`}>
                <p className={styles.videoLabel}>Sample output: 9:16</p>
                <video className={styles.video} src={demoVideoVertical} autoPlay muted loop playsInline controls style={{ aspectRatio: '9 / 16', maxHeight: 360, margin: '0 auto' }} />
              </div>
            </div>
          </div>

          <div className={styles.statBar}>
            <article className={`${styles.stat} surface-card`}>
              <h3>2-4 min</h3>
              <p>Average render time per listing</p>
            </article>
            <article className={`${styles.stat} surface-card`}>
              <h3>2 outputs</h3>
              <p>16:9 and 9:16 in one run</p>
            </article>
            <article className={`${styles.stat} surface-card`}>
              <h3>2-8 hrs saved</h3>
              <p>Compared to manual timeline editing</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">How it works</p>
          <h2>A repeatable workflow for busy listing teams</h2>
          <div className={styles.steps}>
            {steps.map((step) => (
              <article key={step.number} className={`${styles.step} surface-card`}>
                <p className="eyebrow">Step {step.number}</p>
                <h3>{step.title}</h3>
                <p className="text-subtle">{step.description}</p>
                <Image src={step.image} alt={`${step.title} screenshot`} width={1200} height={760} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">Differentiation</p>
          <h2>Why teams pick FastListing over generalist video tools</h2>
          <div className={styles.features}>
            {features.map((feature) => (
              <article key={feature.title} className={`${styles.feature} surface-card`}>
                <h3>{feature.title}</h3>
                <p className="text-subtle">{feature.description}</p>
              </article>
            ))}
          </div>

          <div className={styles.logos}>
            {logos.map((logo) => (
              <Image key={logo} src={logo} alt="Media team logo" width={260} height={58} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">Testimonials</p>
          <h2>Trusted by real estate media professionals</h2>
          <div className={styles.testimonials}>
            {testimonials.map((item) => (
              <article key={item.name} className={`${styles.quote} surface-card`}>
                <p>&quot;{item.quote}&quot;</p>
                <div className={styles.author}>
                  <Image src={item.image} alt={`${item.name} headshot`} width={52} height={52} className={styles.avatar} />
                  <div>
                    <strong>{item.name}</strong>
                    <p className="text-subtle" style={{ margin: 0 }}>{item.title}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.vsGrid}>
            <article className="surface-card" style={{ padding: '1rem 1.2rem' }}>
              <p className="eyebrow">General tools</p>
              <ul className={styles.list}>
                <li>Manual sequencing and timeline editing</li>
                <li>Separate exports per format</li>
                <li>Generic transitions not tuned for property flow</li>
                <li>Brand setup repeated on every project</li>
              </ul>
            </article>
            <article className="surface-card" style={{ padding: '1rem 1.2rem' }}>
              <p className="eyebrow">FastListing</p>
              <ul className={styles.list}>
                <li>AI sequencing built for listing walkthroughs</li>
                <li>Landscape + vertical in one render</li>
                <li>Automated motion and transitions</li>
                <li>Reusable brand presets by agent/team</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={`${styles.cta} surface-card`}>
            <h2>Deliver your next listing video today.</h2>
            <p className="text-subtle">Start with one free render, then scale with Starter or Pro when you are ready.</p>
            <div className={styles.ctaRow} style={{ justifyContent: 'center' }}>
              <Link href="/login" className="btn-primary">Create Free Account</Link>
              <Link href="/security" className="btn-secondary">Review Security</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} FastListing</p>
          <div className={styles.footerLinks}>
            <Link href="/pricing">Pricing</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Refunds</Link>
            <Link href="/security">Security</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
