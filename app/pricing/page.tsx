'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

const starterFeatures = [
  '15 renders per month',
  '16:9 + 9:16 per render',
  'Unlimited brand presets',
  'Licensed audio tracks',
  'Focal-point cropping',
  'Email support',
]

const proFeatures = [
  '50 renders per month',
  '16:9 + 9:16 per render',
  'Unlimited brand presets',
  'Licensed audio tracks',
  'Focal-point cropping',
  'Priority support',
]

const faqs = [
  { q: 'What counts as a render?', a: 'One render = one property project. Each render produces both a 16:9 landscape and a 9:16 vertical MP4.' },
  { q: 'How long does a render take?', a: 'Typically 2–4 minutes depending on the number of photos. You\'ll see a live progress bar and download links appear when complete.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your account settings. You keep access until the end of your billing period.' },
  { q: 'How many photos can I upload per project?', a: 'Up to 30 photos per project. We recommend 15–20 for the best pacing.' },
  { q: 'Is there a free trial?', a: 'Sign up for free and explore the editor. Rendering requires a paid plan.' },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? ''
  const [busyPlan, setBusyPlan] = useState('')

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

  async function handleCheckout(priceId: string, plan: string) {
    trackEvent('pricing_plan_click', { plan })

    if (!userId) {
      trackEvent('pricing_redirect_to_login', { plan })
      window.location.href = '/login'
      return
    }

    setBusyPlan(plan)
    trackEvent('checkout_started', { plan })
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, priceId }),
    })
    const data = await res.json()
    if (data?.url) {
      trackEvent('checkout_redirected', { plan })
      window.location.href = data.url
      return
    }

    trackEvent('checkout_failed', { plan })
    setBusyPlan('')
  }

  return (
    <main style={{ backgroundColor: '#0A0A0A', color: '#F5F5F5', fontFamily: 'var(--font-geist-sans), sans-serif' }}>

      {/* HEADER */}
      <section style={{ padding: '80px 24px 48px', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 16, color: '#888888', lineHeight: 1.6 }}>
          Pay for what you use. No hidden fees. Cancel anytime.
        </p>
      </section>

      {/* PLANS */}
      <section style={{ padding: '0 24px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div style={{
            padding: 32,
            backgroundColor: '#141414',
            border: '1px solid #262626',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
            <div>
              <p style={{ fontSize: 13, color: '#888888', marginBottom: 4 }}>Starter</p>
              <p style={{ fontSize: 13, color: '#888888', marginBottom: 16, fontStyle: 'italic' }}>
                Best for: Individual photographers handling up to 15 listings per month
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em' }}>$29</span>
                <span style={{ fontSize: 14, color: '#888888' }}>/mo</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {starterFeatures.map((f) => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#86EFAC', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#F5F5F5' }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? '', 'starter')}
              disabled={busyPlan !== ''}
              style={{
                padding: '11px 20px',
                backgroundColor: '#1A1A1A',
                color: '#F5F5F5',
                border: '1px solid #262626',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 8,
              }}
            >
              {busyPlan === 'starter' ? 'Redirecting...' : 'Get Starter'}
            </button>
          </div>

          <div style={{
            padding: 32,
            backgroundColor: '#141414',
            border: '1px solid #E8D5B7',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#E8D5B7',
              color: '#0A0A0A',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 12px',
              borderRadius: 20,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              Most Popular
            </div>
            <div>
              <p style={{ fontSize: 13, color: '#888888', marginBottom: 4 }}>Pro</p>
              <p style={{ fontSize: 13, color: '#888888', marginBottom: 16, fontStyle: 'italic' }}>
                Best for: Agencies and high-volume operators handling 15–50 listings per month
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em' }}>$69</span>
                <span style={{ fontSize: 14, color: '#888888' }}>/mo</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {proFeatures.map((f) => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#86EFAC', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#F5F5F5' }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '', 'pro')}
              disabled={busyPlan !== ''}
              style={{
                padding: '11px 20px',
                backgroundColor: '#E8D5B7',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 8,
              }}
            >
              {busyPlan === 'pro' ? 'Redirecting...' : 'Get Pro'}
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, padding: '24px 32px', marginTop: 32, marginBottom: 48, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ fontSize: 24, lineHeight: 1 }}>📦</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>What counts as a render?</p>
            <p style={{ fontSize: 13, color: '#888888', lineHeight: 1.6 }}>
              One render = one property project. When you click Generate, FastListing produces both a 16:9 landscape MP4 and a 9:16 vertical MP4. Both files are included in a single render — you&apos;re not charged twice.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#555', marginTop: 24 }}>
          Payments processed securely by <span style={{ color: '#888' }}>Stripe</span>. All plans billed monthly.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 80px', maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 32, textAlign: 'center' }}>Frequently asked questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {faqs.map((faq) => (
            <div key={faq.q} style={{ padding: '24px', backgroundColor: '#141414', border: '1px solid #262626' }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{faq.q}</p>
              <p style={{ fontSize: 14, color: '#888888', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
