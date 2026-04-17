'use client'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 56px)',
      padding: 24,
    }}>
      <div style={{
        width: 360,
        maxWidth: '100%',
        padding: 32,
        backgroundColor: '#141414',
        borderRadius: 8,
        border: '1px solid #262626',
      }}>
        <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 12 }}>
          Real Estate Video Automation
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 24, marginTop: 0 }}>
          Sign in to FastListing
        </h1>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#E8D5B7',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
