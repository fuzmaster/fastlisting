'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import styles from './page.module.css'

type FormState = {
  contactName: string
  contactEmail: string
  contactPhone: string
  brokerageName: string
  agentName: string
  propertyAddress: string
  propertyPrice: string
  beds: string
  baths: string
  sqft: string
  highlights: string
  primaryColor: string
  secondaryColor: string
  logoNotes: string
  mediaLink: string
  mediaNotes: string
  formats: 'LANDSCAPE' | 'VERTICAL' | 'BOTH'
  musicStyle: string
  voiceover: boolean
  deadline: string
  packageTier: string
  notes: string
}

const TEST_FILL: FormState = {
  contactName: 'Jane Tester',
  contactEmail: 'jane@example.com',
  contactPhone: '(555) 123-4567',
  brokerageName: 'Riverstone Realty',
  agentName: 'Jane Tester',
  propertyAddress: '123 Sunset Blvd, Austin TX 78701',
  propertyPrice: '$849,000',
  beds: '4',
  baths: '2.5',
  sqft: '2,400',
  highlights: 'Chef\'s kitchen, pool, walk to downtown, sunset view from primary.',
  primaryColor: '#c9a97f',
  secondaryColor: '#1f1a17',
  logoNotes: 'Logo and headshot included in the Dropbox folder.',
  mediaLink: 'https://www.dropbox.com/scl/fo/test-listing-photos',
  mediaNotes: 'Photos labeled in shooting order. Skip image 14 (blurry).',
  formats: 'BOTH',
  musicStyle: 'Upbeat acoustic',
  voiceover: false,
  deadline: 'By Friday',
  packageTier: 'SINGLE',
  notes: 'This is a test submission.',
}

const INITIAL: FormState = {
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  brokerageName: '',
  agentName: '',
  propertyAddress: '',
  propertyPrice: '',
  beds: '',
  baths: '',
  sqft: '',
  highlights: '',
  primaryColor: '#c9a97f',
  secondaryColor: '#1f1a17',
  logoNotes: '',
  mediaLink: '',
  mediaNotes: '',
  formats: 'BOTH',
  musicStyle: '',
  voiceover: false,
  deadline: '',
  packageTier: 'SINGLE',
  notes: '',
}

const PACKAGES = [
  {
    id: 'SINGLE',
    name: 'Single Listing',
    price: '$149',
    desc: 'One property, 16:9 + 9:16, 24-hour turnaround.',
  },
  {
    id: 'FIVE_PACK',
    name: '5-Pack',
    price: '$595',
    desc: 'Five listings, batch delivery, save $150 vs single.',
  },
  {
    id: 'MONTHLY',
    name: 'Monthly Retainer',
    price: 'from $1,200',
    desc: 'Up to 15 listings/month, priority turnaround.',
  },
]

const VALID_PACKAGES = new Set(['SINGLE', 'FIVE_PACK', 'MONTHLY'])

export default function IntakePage() {
  return (
    <Suspense fallback={null}>
      <IntakeForm />
    </Suspense>
  )
}

function IntakeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const pkg = searchParams.get('package')
    if (pkg && VALID_PACKAGES.has(pkg)) {
      setForm((prev) => ({ ...prev, packageTier: pkg }))
    }
  }, [searchParams])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Submission failed')
      }
      router.push('/intake/thanks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.wrap}>
      <div className="container">
        <div className={styles.intro}>
          <p className="eyebrow">Start a project</p>
          <h1>Branded listing videos, delivered in 24 hours.</h1>
          <p className="text-subtle">
            Fill out the brief below and send your photos via Dropbox, Google Drive, or WeTransfer.
            I&apos;ll edit, brand, and deliver both 16:9 and 9:16 cuts back to you the next business day.
          </p>
          {process.env.NODE_ENV !== 'production' && (
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '1rem', fontSize: 13, padding: '6px 12px' }}
              onClick={() => setForm(TEST_FILL)}
            >
              Fill test data (dev)
            </button>
          )}
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <section className={`${styles.section} surface-card`}>
            <h2>1. Your contact info</h2>
            <p className={styles.sectionHint}>So I know who to deliver to and how to reach you.</p>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Your name<span className={styles.required}>*</span></label>
                <input
                  required
                  value={form.contactName}
                  onChange={(e) => update('contactName', e.target.value)}
                  placeholder="Jane Agent"
                />
              </div>
              <div className={styles.field}>
                <label>Email<span className={styles.required}>*</span></label>
                <input
                  required
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => update('contactEmail', e.target.value)}
                  placeholder="jane@brokerage.com"
                />
              </div>
              <div className={styles.field}>
                <label>Phone</label>
                <input
                  value={form.contactPhone}
                  onChange={(e) => update('contactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className={styles.field}>
                <label>Brokerage</label>
                <input
                  value={form.brokerageName}
                  onChange={(e) => update('brokerageName', e.target.value)}
                  placeholder="Coldwell Banker, eXp, ..."
                />
              </div>
              <div className={styles.field}>
                <label>Agent name (if different)</label>
                <input
                  value={form.agentName}
                  onChange={(e) => update('agentName', e.target.value)}
                  placeholder="Name to appear on video"
                />
              </div>
            </div>
          </section>

          <section className={`${styles.section} surface-card`}>
            <h2>2. The property</h2>
            <p className={styles.sectionHint}>What we&apos;re featuring — helps me pace the edit.</p>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Address</label>
                <input
                  value={form.propertyAddress}
                  onChange={(e) => update('propertyAddress', e.target.value)}
                  placeholder="123 Main St, Austin TX"
                />
              </div>
              <div className={styles.field}>
                <label>List price</label>
                <input
                  value={form.propertyPrice}
                  onChange={(e) => update('propertyPrice', e.target.value)}
                  placeholder="$849,000"
                />
              </div>
            </div>
            <div className={styles.grid3} style={{ marginTop: '0.85rem' }}>
              <div className={styles.field}>
                <label>Beds</label>
                <input
                  value={form.beds}
                  onChange={(e) => update('beds', e.target.value)}
                  placeholder="4"
                />
              </div>
              <div className={styles.field}>
                <label>Baths</label>
                <input
                  value={form.baths}
                  onChange={(e) => update('baths', e.target.value)}
                  placeholder="2.5"
                />
              </div>
              <div className={styles.field}>
                <label>Sq ft</label>
                <input
                  value={form.sqft}
                  onChange={(e) => update('sqft', e.target.value)}
                  placeholder="2,400"
                />
              </div>
            </div>
            <div className={styles.field} style={{ marginTop: '0.85rem' }}>
              <label>Standout features</label>
              <textarea
                rows={3}
                value={form.highlights}
                onChange={(e) => update('highlights', e.target.value)}
                placeholder="Pool, chef's kitchen, sunset view from primary, walk to downtown..."
              />
            </div>
          </section>

          <section className={`${styles.section} surface-card`}>
            <h2>3. Your branding</h2>
            <p className={styles.sectionHint}>
              Pick the colors that should drive the video. Send your logo with the photos.
            </p>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Primary brand color</label>
                <div className={styles.colorRow}>
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => update('primaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={form.primaryColor}
                    onChange={(e) => update('primaryColor', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Secondary / accent color</label>
                <div className={styles.colorRow}>
                  <input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) => update('secondaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={form.secondaryColor}
                    onChange={(e) => update('secondaryColor', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.field} style={{ marginTop: '0.85rem' }}>
              <label>Logo / headshot notes</label>
              <textarea
                rows={2}
                value={form.logoNotes}
                onChange={(e) => update('logoNotes', e.target.value)}
                placeholder="I'll include logo + headshot in the Dropbox folder. Use dark version on light backgrounds."
              />
            </div>
          </section>

          <section className={`${styles.section} surface-card`}>
            <h2>4. Send me the media</h2>
            <p className={styles.sectionHint}>
              Drop your photos, videos, logo, and headshot into a Dropbox, Google Drive, or
              WeTransfer folder, then paste the share link below. Set the link to view-only with
              no expiration so I can grab everything.
            </p>
            <div className={styles.field}>
              <label>Cloud share link<span className={styles.required}>*</span></label>
              <input
                required
                type="url"
                value={form.mediaLink}
                onChange={(e) => update('mediaLink', e.target.value)}
                placeholder="https://www.dropbox.com/scl/fo/..."
              />
              <span className={styles.hint}>
                Dropbox, Google Drive, WeTransfer, OneDrive — all fine.{' '}
                <a
                  href="https://www.dropbox.com/scl/fo/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--ring)', fontWeight: 600 }}
                >
                  Don&apos;t have Dropbox? Create a free folder →
                </a>
              </span>
            </div>
            <div className={styles.field} style={{ marginTop: '0.85rem' }}>
              <label>Anything I need to know about the media?</label>
              <textarea
                rows={2}
                value={form.mediaNotes}
                onChange={(e) => update('mediaNotes', e.target.value)}
                placeholder="Photos are labeled in shooting order. Skip the two with the dog."
              />
            </div>
          </section>

          <section className={`${styles.section} surface-card`}>
            <h2>5. Delivery preferences</h2>
            <p className={styles.sectionHint}>Tell me how you want the final cut.</p>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Output format</label>
                <select
                  value={form.formats}
                  onChange={(e) =>
                    update('formats', e.target.value as FormState['formats'])
                  }
                >
                  <option value="BOTH">Both 16:9 and 9:16</option>
                  <option value="LANDSCAPE">16:9 only (MLS / YouTube)</option>
                  <option value="VERTICAL">9:16 only (Reels / TikTok)</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Music vibe</label>
                <input
                  value={form.musicStyle}
                  onChange={(e) => update('musicStyle', e.target.value)}
                  placeholder="Upbeat acoustic, luxury cinematic, modern lofi..."
                />
              </div>
              <div className={styles.field}>
                <label>When do you need it?</label>
                <input
                  value={form.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                  placeholder="ASAP, by Friday, no rush..."
                />
              </div>
              <div className={styles.field}>
                <div className={styles.checkboxRow} style={{ marginTop: '1.6rem' }}>
                  <input
                    id="voiceover"
                    type="checkbox"
                    checked={form.voiceover}
                    onChange={(e) => update('voiceover', e.target.checked)}
                  />
                  <label htmlFor="voiceover">Add AI voiceover narration (+$40)</label>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.section} surface-card`}>
            <h2>6. Pick a package</h2>
            <p className={styles.sectionHint}>I&apos;ll send an invoice on delivery.</p>
            <div className={styles.packageRow}>
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  className={`${styles.packageOption} ${
                    form.packageTier === pkg.id ? styles.selected : ''
                  }`}
                  onClick={() => update('packageTier', pkg.id)}
                >
                  <h3>{pkg.name}</h3>
                  <p className={styles.price}>{pkg.price}</p>
                  <p className={styles.desc}>{pkg.desc}</p>
                </button>
              ))}
            </div>
            <div className={styles.field} style={{ marginTop: '1rem' }}>
              <label>Anything else?</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Special requests, references, links to videos you love..."
              />
            </div>
          </section>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.submitRow}>
            <button
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Submit request'}
            </button>
            <p className="text-subtle" style={{ fontSize: '0.85rem', margin: 0 }}>
              You&apos;ll get a confirmation email within minutes. No payment until delivery.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
