import Link from 'next/link'

const controls = [
  {
    title: 'Data ownership',
    body: 'Customers retain full ownership of uploaded media and exported videos. FastListing processes files only to generate requested output.',
  },
  {
    title: 'Access control',
    body: 'Authentication is enforced via NextAuth with Google OAuth and email/password credentials. API ownership checks restrict data mutation to resource owners.',
  },
  {
    title: 'Storage and transport',
    body: 'Uploads are stored in AWS S3 with encrypted transfer and scoped object keys. Application traffic is served over HTTPS.',
  },
  {
    title: 'Payments',
    body: 'Billing is processed by Stripe. FastListing does not store raw card details.',
  },
  {
    title: 'Validation and handling',
    body: 'API payloads are validated with schema checks and wrapped in explicit error handling to reduce malformed request risk.',
  },
]

export default function SecurityPage() {
  return (
    <main style={{ padding: '2.5rem 0 3rem' }}>
      <section className="container">
        <p className="eyebrow">Security and Compliance</p>
        <h1>Security controls designed for listing media operations</h1>
        <p className="text-subtle" style={{ maxWidth: 760 }}>
          FastListing applies practical controls for identity, data handling, and billing workflows. For contractual security inquiries,
          contact support.
        </p>

        <div style={{ display: 'grid', gap: '0.85rem', marginTop: '1.2rem' }}>
          {controls.map((control) => (
            <article key={control.title} className="surface-card" style={{ padding: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>{control.title}</h3>
              <p className="text-subtle" style={{ marginBottom: 0 }}>{control.body}</p>
            </article>
          ))}
        </div>

        <div className="surface-card" style={{ marginTop: '1rem', padding: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Policy links</h3>
          <p className="text-subtle" style={{ marginBottom: 0 }}>
            Review our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms and Refund policy</Link> for full details.
          </p>
        </div>
      </section>
    </main>
  )
}
