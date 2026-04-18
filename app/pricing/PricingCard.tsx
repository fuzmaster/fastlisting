'use client'

type PricingCardProps = {
  title: string
  description: string
  price: string
  features: string[]
  priceId: string
  userId: string
  label: string
  featured?: boolean
}

export function PricingCard({ title, description, price, features, priceId, userId, label, featured }: PricingCardProps) {
  return (
    <div style={{
      padding: 32,
      backgroundColor: '#141414',
      border: `1px solid ${featured ? '#E8D5B7' : '#262626'}`,
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      position: 'relative',
    }}>
      {featured && (
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
      )}

      <div>
        <p style={{ fontSize: 13, color: '#888888', marginBottom: 4 }}>{title}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em' }}>{price}</span>
          <span style={{ fontSize: 14, color: '#888888' }}>/mo</span>
        </div>
        <p style={{ fontSize: 13, color: '#888888', lineHeight: 1.5 }}>{description}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map((f) => (
          <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: '#86EFAC', flexShrink: 0, marginTop: 1 }}>✓</span>
            <span style={{ fontSize: 13, color: '#F5F5F5' }}>{f}</span>
          </div>
        ))}
      </div>

      <button
        onClick={async () => {
          if (!userId) { window.location.href = '/login'; return }
          const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, priceId }),
          })
          const data = await res.json()
          if (data?.url) window.location.href = data.url
        }}
        style={{
          padding: '11px 20px',
          backgroundColor: featured ? '#E8D5B7' : '#1A1A1A',
          color: featured ? '#0A0A0A' : '#F5F5F5',
          border: featured ? 'none' : '1px solid #262626',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        {label}
      </button>
    </div>
  )
}
