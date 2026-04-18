'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

import styles from './page.module.css'

const starterFeatures = [
  '15 renders/month (both 16:9 + 9:16 per render)',
  'AI sequencing + automatic transitions',
  'Unlimited branding presets',
  'Licensed music library',
  'Standard support',
]

const proFeatures = [
  '50 renders/month (both 16:9 + 9:16 per render)',
  'Priority queue rendering',
  'Unlimited branding presets',
  'Licensed music library',
  'Priority support',
]

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every account gets one free render before payment so you can test output quality with your own listing photos.',
  },
  {
    q: 'Who owns uploaded photos and final videos?',
    a: 'You keep full ownership of uploaded media and exported videos. FastListing only processes assets to generate requested output.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Paid plans include a 14-day satisfaction refund guarantee. Reach out to support and we will process eligible requests promptly.',
  },
  {
    q: 'How long are the generated videos?',
    a: 'Most videos run around 35-75 seconds depending on photo count and pacing. The same project renders both 16:9 and 9:16 versions.',
  },
  {
    q: 'How fast is rendering?',
    a: 'Typical render time is 2-4 minutes. Manual editing workflows usually take 2-8 hours for equivalent multi-format delivery.',
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [busyPlan, setBusyPlan] = useState('')

  async function handleCheckout(priceId: string, plan: string) {
    if (!session?.user?.id) {
      window.location.href = '/login'
      return
    }

    setBusyPlan(plan)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const data = await res.json()
    if (data?.url) {
      window.location.href = data.url
      return
    }

    setBusyPlan('')
  }

  return (
    <main className={styles.shell}>
      <section className="container">
        <div className={styles.header}>
          <p className="eyebrow">Pricing</p>
          <h1>Scale listing video output with predictable monthly plans</h1>
          <p className="text-subtle">Start with one free render, then choose the plan that matches your monthly listing volume.</p>
        </div>

        <div className={styles.planGrid}>
          <article className={`${styles.plan} surface-card`}>
            <p className="eyebrow">Starter</p>
            <p className={styles.price}>$29<span style={{ fontSize: '0.95rem' }}>/mo</span></p>
            <p className="text-subtle">Best for solo creators and boutique teams.</p>
            <ul className={styles.features}>
              {starterFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <button
              className="btn-secondary"
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? '', 'starter')}
              disabled={busyPlan !== ''}
            >
              {busyPlan === 'starter' ? 'Redirecting...' : 'Choose Starter'}
            </button>
          </article>

          <article className={`${styles.plan} ${styles.featured} surface-card`}>
            <p className={styles.badge}>Most popular</p>
            <p className="eyebrow" style={{ marginTop: '0.7rem' }}>Pro</p>
            <p className={styles.price}>$69<span style={{ fontSize: '0.95rem' }}>/mo</span></p>
            <p className="text-subtle">Built for high-volume agencies and media teams.</p>
            <ul className={styles.features}>
              {proFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <button
              className="btn-primary"
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '', 'pro')}
              disabled={busyPlan !== ''}
            >
              {busyPlan === 'pro' ? 'Redirecting...' : 'Choose Pro'}
            </button>
          </article>
        </div>

        <section className={styles.faq}>
          <h2>FAQ</h2>
          {faqs.map((faq) => (
            <article key={faq.q} className={`${styles.faqItem} surface-card`}>
              <h3>{faq.q}</h3>
              <p className="text-subtle">{faq.a}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}
