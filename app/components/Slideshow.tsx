'use client'

import { useEffect, useState } from 'react'

type Props = {
  images: string[]
  intervalMs?: number
  caption?: string
  aspectRatio?: string
}

export function Slideshow({
  images,
  intervalMs = 2800,
  caption,
  aspectRatio = '16 / 9',
}: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || images.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs)
    return () => clearInterval(t)
  }, [paused, intervalMs, images.length])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ width: '100%' }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: '#1f1a17',
        }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            aria-hidden={i !== index}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === index ? 1 : 0,
              transform: i === index ? 'scale(1.04)' : 'scale(1)',
              transition: 'opacity 900ms ease, transform 3200ms ease-out',
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            inset: 'auto 0 0 0',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
            height: '40%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 16,
            bottom: 14,
            color: '#f8f5ef',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {index + 1} / {images.length}
        </div>

        <div
          style={{
            position: 'absolute',
            right: 16,
            bottom: 14,
            display: 'flex',
            gap: 6,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                padding: 0,
                borderRadius: 999,
                border: 'none',
                background: i === index ? '#c9a97f' : 'rgba(248,245,239,0.5)',
                cursor: 'pointer',
                transition: 'width 0.2s, background 0.2s',
              }}
            />
          ))}
        </div>
      </div>
      {caption && (
        <p
          style={{
            marginTop: 10,
            fontSize: 14,
            color: 'var(--text-subtle)',
            textAlign: 'center',
          }}
        >
          {caption}
        </p>
      )}
    </div>
  )
}
