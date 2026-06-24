'use client'

import Link from 'next/link'

import styles from './page.module.css'
import { Logo } from './components/Logo'
import { Slideshow } from './components/Slideshow'

const SAMPLE_LISTING = Array.from({ length: 10 }, (_, i) => `/samples/listing-middle-rd/${String(i + 1).padStart(2, '0')}.jpg`)

const steps = [
  {
    number: '01',
    title: 'Submit a brief',
    description:
      'Tell me about the listing, your brand colors, and how you want it delivered. Takes about 3 minutes.',
  },
  {
    number: '02',
    title: 'Send the photos',
    description:
      'Drop your shots, logo, and headshot into Dropbox, Drive, or WeTransfer and paste the share link. No file size limits.',
  },
  {
    number: '03',
    title: 'Receive your videos',
    description:
      'Within 24 hours I deliver both 16:9 and 9:16 cuts, fully branded, ready for MLS, Reels, and TikTok.',
  },
]

const reasons = [
  {
    title: 'You shoot. I edit.',
    description:
      'Stop spending evenings in Premiere or Capcut. Hand me the photos and get back to selling houses.',
  },
  {
    title: 'Two formats, one price',
    description:
      'Every package includes both the horizontal MLS cut and the vertical social cut. Always.',
  },
  {
    title: 'On-brand every time',
    description:
      'Your colors, logo, and headshot baked in. Consistent across every listing you send.',
  },
  {
    title: 'Licensed music included',
    description:
      'I use a library of pre-cleared tracks, so nothing gets pulled off Instagram for copyright.',
  },
  {
    title: '24-hour turnaround',
    description:
      'Single listings deliver next business day. Need it faster? Rush options available.',
  },
  {
    title: 'No subscription required',
    description:
      'Pay per listing or grab a 5-pack. Only commit to monthly if you&apos;re shipping 10+ a month.',
  },
]

const packages = [
  {
    name: 'Single Listing',
    price: '$149',
    blurb: 'Perfect for testing the workflow on a hot listing.',
    bullets: [
      'One property',
      '16:9 + 9:16 included',
      '24-hour turnaround',
      'Up to 30 photos',
      'Branded with your colors + logo',
    ],
  },
  {
    name: '5-Pack',
    price: '$595',
    blurb: 'For agents averaging a listing a week. Save $150 vs single.',
    bullets: [
      'Five properties',
      'All formats included',
      'Use anytime in 90 days',
      'Up to 30 photos each',
      'Priority queue',
    ],
    featured: true,
  },
  {
    name: 'Monthly Retainer',
    price: 'from $1,200/mo',
    blurb: 'For high-volume teams and brokerages.',
    bullets: [
      'Up to 15 listings/month',
      'Same-day rush available',
      'Dedicated turnaround slot',
      'Custom intro/outro template',
      'Monthly invoice',
    ],
  },
]

const faqs = [
  {
    q: 'What do I need to send you?',
    a: 'Listing photos (up to 30), your logo, your headshot, and your brand colors. The intake form walks you through every field.',
  },
  {
    q: 'How fast is delivery?',
    a: 'Standard turnaround is 24 hours from the moment I receive your photos. Monthly retainer clients can request same-day rush.',
  },
  {
    q: 'What if I need a revision?',
    a: 'Every order includes one round of revisions free. Common tweaks (music swap, photo order, branding adjustments) usually turn around same-day.',
  },
  {
    q: 'How do I pay?',
    a: 'I send a Stripe invoice on delivery — no payment up front. Monthly retainers are billed at the start of each cycle.',
  },
  {
    q: 'Can I see samples before I order?',
    a: 'Yes — the demo videos at the top of this page are real outputs from the same pipeline I use for every project.',
  },
]

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <p className="eyebrow">Done-for-you listing video</p>
              <h1 className={styles.heroTitle}>
                You shoot the photos. I deliver branded listing videos in 24 hours.
              </h1>
              <p className={styles.heroSub}>
                Send your listing photos via Dropbox or Drive. I&apos;ll edit, brand, and deliver
                both 16:9 and 9:16 cuts back to you the next business day. No software to learn, no
                subscription required.
              </p>
              <div className={styles.ctaRow}>
                <Link href="/intake" className="btn-primary">
                  Start a project
                </Link>
                <Link href="#packages" className="btn-secondary">
                  See packages
                </Link>
              </div>
              <p className={styles.trustRow}>
                Pay on delivery. One free revision per project. Most listings out the door in under
                24 hours.
              </p>
            </div>

            <div className={`${styles.heroCollage} surface-card`}>
              <p className={styles.videoLabel}>Recent work</p>
              <div className={styles.collageGrid}>
                <div className={styles.collageTile} style={{ backgroundImage: 'url(/samples/britten-aerial/02-westborough-house.jpg)' }} aria-label="Aerial property shot" />
                <div className={styles.collageTile} style={{ backgroundImage: 'url(/samples/listing-middle-rd/01.jpg)' }} aria-label="Front exterior" />
                <div className={styles.collageTile} style={{ backgroundImage: 'url(/samples/listing-feb-2024/01.jpg)' }} aria-label="Modern interior" />
                <div className={styles.collageTile} style={{ backgroundImage: 'url(/samples/listing-twilight/02.jpg)' }} aria-label="Twilight exterior" />
              </div>
              <p className={styles.collageCaption}>
                Photos from real shoots — sample inputs the same way you&apos;d send yours.
              </p>
            </div>
          </div>

          <div className={styles.statBar}>
            <article className={`${styles.stat} surface-card`}>
              <h3>24 hours</h3>
              <p>Standard turnaround</p>
            </article>
            <article className={`${styles.stat} surface-card`}>
              <h3>Both formats</h3>
              <p>16:9 + 9:16 always included</p>
            </article>
            <article className={`${styles.stat} surface-card`}>
              <h3>$149</h3>
              <p>Starts at — per listing</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">Sample delivery</p>
          <h2>This is what you get back.</h2>
          <p className="text-subtle" style={{ maxWidth: 620, marginBottom: '1.5rem' }}>
            Ten listing photos, automatically sequenced for room-to-room flow, paced with subtle
            Ken Burns motion. Hover to pause.
          </p>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <Slideshow
              images={SAMPLE_LISTING}
              caption="187 Middle Rd, Southborough · 10 photos · 16:9 cut shown"
            />
          </div>
        </div>
      </section>

      <section className={styles.section} id="how-it-works">
        <div className="container">
          <p className="eyebrow">How it works</p>
          <h2>Three steps. No software. No timeline editing.</h2>
          <div className={styles.steps3}>
            {steps.map((step) => (
              <article key={step.number} className={`${styles.step} surface-card`}>
                <p className="eyebrow">Step {step.number}</p>
                <h3>{step.title}</h3>
                <p className="text-subtle">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">Why agents send me their listings</p>
          <h2>Built for the agent who&apos;d rather sell houses than edit video.</h2>
          <div className={styles.features}>
            {reasons.map((reason) => (
              <article key={reason.title} className={`${styles.feature} surface-card`}>
                <h3>{reason.title}</h3>
                <p className="text-subtle">{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="packages">
        <div className="container">
          <p className="eyebrow">Packages</p>
          <h2>Pay per listing, or save with a pack.</h2>
          <div className={styles.packages}>
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`${styles.package} surface-card ${pkg.featured ? styles.packageFeatured : ''}`}
              >
                {pkg.featured && <span className={styles.badge}>Most popular</span>}
                <h3>{pkg.name}</h3>
                <p className={styles.packagePrice}>{pkg.price}</p>
                <p className="text-subtle" style={{ minHeight: 48 }}>
                  {pkg.blurb}
                </p>
                <ul className={styles.bulletList}>
                  {pkg.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link href="/intake" className="btn-primary" style={{ marginTop: '0.6rem' }}>
                  Choose {pkg.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <p className="eyebrow">Common questions</p>
          <h2>Quick answers before you submit.</h2>
          <div className={styles.faqs}>
            {faqs.map((f) => (
              <article key={f.q} className={`${styles.faq} surface-card`}>
                <h3>{f.q}</h3>
                <p className="text-subtle">{f.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={`${styles.cta} surface-card`}>
            <h2>Ready to ship your next listing?</h2>
            <p className="text-subtle">
              The intake form takes about three minutes. I&apos;ll confirm within hours and start
              editing as soon as your media arrives.
            </p>
            <div className={styles.ctaRow} style={{ justifyContent: 'center' }}>
              <Link href="/intake" className="btn-primary">
                Start a project
              </Link>
              <Link href="mailto:hello@fastlisting.com" className="btn-secondary">
                Ask a question first
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo height={22} />
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/intake">Start a project</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
