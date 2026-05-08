'use client'

import { useState } from 'react'
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

const betaHighlights = [
  'Private beta opening now',
  'Early access teams receive onboarding support',
  'Your feedback directly shapes launch roadmap',
]

const demoVideoLandscape = '/videos/fastlisting-demo-16x9.mp4'
const demoVideoVertical = '/videos/fastlisting-demo-9x16.mp4'

export default function HomePage() {
  const [landscapeVideoReady, setLandscapeVideoReady] = useState(true)
  const [verticalVideoReady, setVerticalVideoReady] = useState(true)

  const renderVideoFallback = (label: string) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 220,
        color: '#888888',
        border: '1px solid #262626',
        borderRadius: 8,
        backgroundColor: '#101010',
      }}
    >
      {label}
    </div>
  )

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
                {landscapeVideoReady ? (
                  <video className={styles.video} src={demoVideoLandscape} autoPlay muted loop playsInline controls onError={() => setLandscapeVideoReady(false)} />
                ) : renderVideoFallback('Demo video coming soon')}
              </div>
              <div className={`${styles.videoCard} surface-card`}>
                <p className={styles.videoLabel}>Sample output: 9:16</p>
                {verticalVideoReady ? (
                  <video className={styles.video} src={demoVideoVertical} autoPlay muted loop playsInline controls style={{ aspectRatio: '9 / 16', maxHeight: 360, margin: '0 auto' }} onError={() => setVerticalVideoReady(false)} />
                ) : renderVideoFallback('Demo video coming soon')}
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
            {betaHighlights.map((item) => (
              <article key={item} className="surface-card" style={{ padding: '0.8rem 1rem', minWidth: 220 }}>
                <p style={{ margin: 0, color: '#d8d8d8', fontSize: 13 }}>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">Private beta</p>
          <h2>Private beta opening now for select teams</h2>
          <article className={`${styles.quote} surface-card`}>
            <p>We are onboarding early users now. Join the private beta to help shape the final public MVP launch.</p>
          </article>
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
