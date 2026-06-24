type Props = {
  height?: number
  showWordmark?: boolean
  variant?: 'default' | 'mono'
  ariaLabel?: string
}

export function Logo({
  height = 28,
  showWordmark = true,
  variant = 'default',
  ariaLabel = 'FastListing',
}: Props) {
  const primary = variant === 'mono' ? 'currentColor' : '#c9a97f'
  const accent = variant === 'mono' ? 'currentColor' : '#E8D5B7'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: showWordmark ? 10 : 0,
        lineHeight: 1,
      }}
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 64 40"
        width={height * 1.6}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <rect
          x="2"
          y="4"
          width="36"
          height="32"
          rx="8"
          fill="none"
          stroke={primary}
          strokeWidth="3"
        />
        <path d="M15 12 L26 20 L15 28 Z" fill={primary} />
        <rect x="46" y="13" width="5" height="22" rx="1.5" fill={primary} />
        <rect x="55" y="13" width="5" height="22" rx="1.5" fill={accent} opacity="0.7" />
      </svg>
      {showWordmark && (
        <span
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontWeight: 700,
            fontSize: height * 0.72,
            letterSpacing: '-0.02em',
            color: 'inherit',
          }}
        >
          FastListing
        </span>
      )}
    </span>
  )
}
