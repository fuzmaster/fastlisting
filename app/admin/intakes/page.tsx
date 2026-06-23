import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { listIntakes } from '@/lib/db/intakes'
import styles from './page.module.css'

const STATUS_CLASS: Record<string, string> = {
  NEW: styles.statusNew,
  IN_PROGRESS: styles.statusInProgress,
  DELIVERED: styles.statusDelivered,
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

export default async function AdminIntakesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const intakes = await listIntakes()

  return (
    <main className={styles.shell}>
      <section className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow">Operator console</p>
            <h1 style={{ margin: '0.3rem 0 0' }}>Intakes</h1>
          </div>
          <div className={styles.headerLinks}>
            <Link href="/dashboard" className="btn-secondary">
              Projects
            </Link>
            <Link href="/" className="btn-secondary">
              Public site
            </Link>
          </div>
        </div>

        {intakes.length === 0 ? (
          <div className={`${styles.empty} surface-card`}>
            No intake submissions yet. They&apos;ll appear here as clients submit briefs.
          </div>
        ) : (
          <div className={styles.list}>
            {intakes.map((intake) => (
              <Link
                key={intake.id}
                href={`/admin/intakes/${intake.id}`}
                className={`${styles.row} surface-card`}
              >
                <div className={styles.rowMain}>
                  <strong>{intake.contactName}</strong>
                  <span>
                    {intake.propertyAddress || 'No address'} · {intake.contactEmail}
                  </span>
                </div>
                <div className={styles.cellMuted}>
                  {intake.packageTier || '—'}
                  <br />
                  {intake.deadline || 'No deadline'}
                </div>
                <div className={styles.cellMuted}>{formatDate(intake.createdAt)}</div>
                <div className={`${styles.status} ${STATUS_CLASS[intake.status] || ''}`}>
                  {intake.status.replace('_', ' ')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
