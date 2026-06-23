import Link from 'next/link'

export default function ThanksPage() {
  return (
    <main style={{ padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: 620, textAlign: 'center' }}>
        <div className="surface-card" style={{ padding: '2.5rem 2rem' }}>
          <p className="eyebrow">Request received</p>
          <h1 style={{ margin: '0.6rem 0 1rem' }}>Thanks — I&apos;ll be in touch shortly.</h1>
          <p className="text-subtle" style={{ lineHeight: 1.65 }}>
            Your brief is in my queue. I&apos;ll review the media link and email you within a few
            hours to confirm timing, package, and any clarifications. Most listings deliver within
            24 hours of confirmation.
          </p>
          <p className="text-subtle" style={{ marginTop: '1.2rem', fontSize: '0.9rem' }}>
            If you need to send anything else, just reply to my confirmation email — no need to
            resubmit the form.
          </p>
          <div style={{ marginTop: '1.75rem' }}>
            <Link href="/" className="btn-secondary">
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
