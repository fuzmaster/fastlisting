import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 56px)',
      padding: 24,
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 12, letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase', marginBottom: 16 }}>
        Real Estate Video Automation
      </p>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
        Property photos to<br />branded video in minutes.
      </h1>
      <p style={{ fontSize: 16, color: '#888888', maxWidth: 480, marginBottom: 40, lineHeight: 1.6 }}>
        Upload your listing photos, set your brand, and generate 16:9 and 9:16 MP4s ready for MLS and social.
      </p>
      <Link href="/login" style={{
        padding: '12px 28px',
        backgroundColor: '#E8D5B7',
        color: '#0A0A0A',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
      }}>
        Get Started
      </Link>
    </main>
  )
}
