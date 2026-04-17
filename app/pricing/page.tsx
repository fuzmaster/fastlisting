import { PricingCard } from './PricingCard'

const DEV_USER_ID = 'dev-user-001'

export default function PricingPage() {
  return (
    <main style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 8 }}>
          Billing
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16, marginTop: 0 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 16, color: '#888888', maxWidth: 480, margin: '0 auto' }}>Choose the plan that fits your business. Upgrade or downgrade anytime.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginTop: 32 }}>
        <PricingCard
          title="Starter"
          rendersText="15 renders per month"
          priceText="$29"
          period="/mo"
          priceId={process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? ''}
          userId={DEV_USER_ID}
          label="Get Starter"
          featured={false}
        />
        <PricingCard
          title="Pro"
          rendersText="50 renders per month"
          priceText="$69"
          period="/mo"
          priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? ''}
          userId={DEV_USER_ID}
          label="Get Pro"
          featured={true}
        />
      </div>
    </main>
  )
}