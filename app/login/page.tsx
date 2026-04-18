'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'

import styles from './page.module.css'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleEmailAuth(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setBusy(true)

    try {
      if (mode === 'signup') {
        const registerRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const registerData = await registerRes.json()
        if (!registerRes.ok) {
          setError(registerData.error ?? 'Could not create account.')
          setBusy(false)
          return
        }
      }

      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInRes?.ok) {
        setSuccess('Success. Redirecting...')
        window.location.href = '/dashboard'
        return
      }

      setError('Invalid email or password.')
    } catch {
      setError('Unable to authenticate right now. Please try again.')
    }

    setBusy(false)
  }

  return (
    <main className={styles.shell}>
      <section className={`${styles.card} surface-card`}>
        <p className="eyebrow">Account Access</p>
        <h1 style={{ marginTop: 0 }}>Start your free trial</h1>
        <p className={styles.hint}>
          Create an account to unlock one free render. Paid plans include a 14-day satisfaction refund guarantee.
        </p>

        <div className={styles.tabs} role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            className={`${styles.tab} ${mode === 'signin' ? styles.active : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`}
            onClick={() => setMode('signup')}
          >
            Create account
          </button>
        </div>

        <form className={styles.form} onSubmit={handleEmailAuth}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@agency.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder="Minimum 8 characters"
            />
          </label>
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Please wait...' : mode === 'signup' ? 'Create account and continue' : 'Sign in'}
          </button>
        </form>

        <div className={styles.actions} style={{ marginTop: '0.75rem' }}>
          <button className="btn-secondary" type="button" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            Continue with Google
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <p className={styles.hint}>
          By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>. View platform safeguards on <Link href="/security">Security</Link>.
        </p>
      </section>
    </main>
  )
}
