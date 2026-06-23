import Link from 'next/link'

import styles from './page.module.css'

const packages = [
  {
    id: 'SINGLE',
    name: 'Single Listing',
    price: '$149',
    cadence: 'per listing',
    blurb: 'Perfect for testing the workflow on a hot listing.',
    features: [
      'One property',
      'Both 16:9 and 9:16 included',
      '24-hour turnaround',
      'Up to 30 photos',
      'Branded with your colors + logo',
      'Licensed music included',
      'One free revision round',
    ],
  },
  {
    id: 'FIVE_PACK',
    name: '5-Pack',
    price: '$595',
    cadence: 'one-time',
    badge: 'Most popular',
    blurb: 'For agents averaging a listing a week. Save $150 vs single.',
    features: [
      'Five properties',
      'All formats included',
      'Use anytime in 90 days',
      'Up to 30 photos each',
      'Priority queue',
      'One free revision per video',
      'Pay one invoice, no subscription',
    ],
    featured: true,
  },
  {
    id: 'MONTHLY',
    name: 'Monthly Retainer',
    price: 'from $1,200',
    cadence: 'per month',
    blurb: 'For high-volume teams and brokerages.',
    features: [
      'Up to 15 listings/month',
      'Same-day rush available',
      'Dedicated turnaround slot',
      'Custom intro/outro template',
      'Monthly Stripe invoice',
      'Quarterly brand refresh consult',
    ],
  },
]

const faqs = [
  {
    q: 'When do I pay?',
    a: 'Single and 5-Pack: I send a Stripe invoice on delivery, payable on net-7 terms. Monthly retainers are billed at the start of each cycle.',
  },
  {
    q: 'What does turnaround mean exactly?',
    a: 'I confirm receipt within a few hours of your intake submission. From the moment I have your photos and brief, single listings deliver within 24 business hours. Retainer same-day rush is best-effort within 8 hours.',
  },
  {
    q: 'What if I need revisions?',
    a: 'One free revision round per video, covering music swap, photo reorder, branding tweaks, or trim changes. Additional rounds are $25 each.',
  },
  {
    q: 'Do you keep my photos?',
    a: 'No. Source media is purged 30 days after delivery. You own the photos and the final videos outright.',
  },
  {
    q: 'Can I cancel my retainer?',
    a: 'Yes — month-to-month, cancel anytime before the next billing date. Unused listings within a cycle don\'t roll over.',
  },
  {
    q: 'How do you handle rush jobs?',
    a: 'Rush is available for retainer clients (best-effort 8-hour delivery) and as a +$75 add-on for single and 5-Pack clients (12-hour delivery). Mention it in your intake notes.',
  },
]

export default function PricingPage() {
  return (
    <main className={styles.shell}>
      <section className="container">
        <div className={styles.header}>
          <p className="eyebrow">Pricing</p>
          <h1>Pay per listing, or save with a pack.</h1>
          <p className="text-subtle">
            No subscription required for single and pack pricing. Pay on delivery — Stripe invoice,
            net-7 terms. Monthly retainers for agents shipping 10+ listings a month.
          </p>
        </div>

        <div className={styles.planGrid}>
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className={`${styles.plan} ${pkg.featured ? styles.featured : ''} surface-card`}
            >
              {pkg.badge && <p className={styles.badge}>{pkg.badge}</p>}
              <p className="eyebrow" style={{ marginTop: pkg.badge ? '0.7rem' : 0 }}>
                {pkg.name}
              </p>
              <p className={styles.price}>
                {pkg.price}
                <span style={{ fontSize: '0.95rem' }}> {pkg.cadence}</span>
              </p>
              <p className="text-subtle">{pkg.blurb}</p>
              <ul className={styles.features}>
                {pkg.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link href={`/intake?package=${pkg.id}`} className={pkg.featured ? 'btn-primary' : 'btn-secondary'}>
                Start with {pkg.name}
              </Link>
            </article>
          ))}
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
