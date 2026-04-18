'use client'

import { useState } from 'react'

export function ManageBillingButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not open billing portal.')
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: '7px 16px',
          backgroundColor: 'transparent',
          border: '1px solid #262626',
          color: '#888888',
          borderRadius: 6,
          fontSize: 13,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Loading...' : 'Manage Billing'}
      </button>
      {error && <p style={{ fontSize: 12, color: '#FCA5A5', marginTop: 6 }}>{error}</p>}
    </div>
  )
}
