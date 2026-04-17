'use client'

type PricingCardProps = {
  title: string
  rendersText: string
  priceText: string
  priceId: string
  userId: string
  label: string
}

type FullPricingCardProps = PricingCardProps & {
  period?: string
  featured?: boolean
}

export function PricingCard({ title, rendersText, priceText, priceId, userId, label, period = '', featured = false }: FullPricingCardProps) {
  return (
    <div style={{
      padding: 32,
      backgroundColor: featured ? '#141414' : '#0A0A0A',
      border: `2px solid ${featured ? '#E8D5B7' : '#262626'}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.15s, border-color 0.15s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      if (!featured) e.currentTarget.style.borderColor = '#E8D5B7'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      if (!featured) e.currentTarget.style.borderColor = '#262626'
    }}
    >
      {featured && (
        <div style={{
          position: 'absolute',
          top: -12,
          left: 16,
          backgroundColor: '#E8D5B7',
          color: '#0A0A0A',
          padding: '4px 12px',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Recommended
        </div>
      )}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, marginTop: featured ? 12 : 0 }}>{title}</h2>
      <p style={{ fontSize: 14, color: '#888888', marginBottom: 24, marginTop: 0 }}>{rendersText}</p>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 0, marginTop: 0 }}>
          {priceText}
          {period && <span style={{ fontSize: 14, fontWeight: 400, color: '#888888' }}>{period}</span>}
        </p>
      </div>
      <button
        type="button"
        style={{
          width: '100%',
          padding: '12px 16px',
          marginTop: 'auto',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: featured ? '#E8D5B7' : '#262626',
          color: featured ? '#0A0A0A' : '#F5F5F5',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        onClick={async () => {
          const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, priceId }),
          })
          const data = await response.json()
          if (data?.url) {
            window.location.href = data.url
          }
        }}
      >
        {label}
      </button>
    </div>
  )
}
