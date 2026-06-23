import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getIntakeById, updateIntakeStatus } from '@/lib/db/intakes'
import styles from '../page.module.css'

const STATUSES = ['NEW', 'IN_PROGRESS', 'DELIVERED'] as const
type Status = (typeof STATUSES)[number]

async function setStatus(formData: FormData) {
  'use server'
  const id = String(formData.get('id') || '')
  const status = String(formData.get('status') || '')
  if (!id || !STATUSES.includes(status as Status)) return
  await updateIntakeStatus(id, status)
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

export default async function IntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const intake = await getIntakeById(id)
  if (!intake) notFound()

  return (
    <main className={styles.shell}>
      <section className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow">Intake · {formatDate(intake.createdAt)}</p>
            <h1 style={{ margin: '0.3rem 0 0' }}>{intake.contactName}</h1>
            <p className="text-subtle" style={{ margin: '0.2rem 0 0' }}>
              {intake.propertyAddress || 'No address provided'}
            </p>
          </div>
          <Link href="/admin/intakes" className="btn-secondary">
            ← All intakes
          </Link>
        </div>

        <div className={styles.detailGrid}>
          <article className={`${styles.detailSection} surface-card`}>
            <h2>Status</h2>
            <div className={styles.statusBar}>
              {STATUSES.map((s) => (
                <form key={s} action={setStatus}>
                  <input type="hidden" name="id" value={intake.id} />
                  <input type="hidden" name="status" value={s} />
                  <button
                    type="submit"
                    className={intake.status === s ? 'btn-primary' : 'btn-secondary'}
                    style={{ fontSize: 13, padding: '6px 12px' }}
                  >
                    {s.replace('_', ' ')}
                  </button>
                </form>
              ))}
            </div>
          </article>

          <article className={`${styles.detailSection} surface-card`}>
            <h2>Media</h2>
            <p>
              <a
                className={styles.mediaLink}
                href={intake.mediaLink}
                target="_blank"
                rel="noreferrer"
              >
                {intake.mediaLink}
              </a>
            </p>
            {intake.mediaNotes && (
              <p className="text-subtle" style={{ margin: '0.5rem 0 0' }}>
                {intake.mediaNotes}
              </p>
            )}
          </article>

          <article className={`${styles.detailSection} surface-card`}>
            <h2>Contact</h2>
            <dl className={styles.kv}>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${intake.contactEmail}`}>{intake.contactEmail}</a>
              </dd>
              {intake.contactPhone && (
                <>
                  <dt>Phone</dt>
                  <dd>{intake.contactPhone}</dd>
                </>
              )}
              {intake.brokerageName && (
                <>
                  <dt>Brokerage</dt>
                  <dd>{intake.brokerageName}</dd>
                </>
              )}
              {intake.agentName && (
                <>
                  <dt>Agent name</dt>
                  <dd>{intake.agentName}</dd>
                </>
              )}
            </dl>
          </article>

          <article className={`${styles.detailSection} surface-card`}>
            <h2>Property</h2>
            <dl className={styles.kv}>
              {intake.propertyPrice && (
                <>
                  <dt>List price</dt>
                  <dd>{intake.propertyPrice}</dd>
                </>
              )}
              {intake.beds && (
                <>
                  <dt>Beds / baths / sqft</dt>
                  <dd>
                    {intake.beds || '—'} / {intake.baths || '—'} / {intake.sqft || '—'}
                  </dd>
                </>
              )}
              {intake.highlights && (
                <>
                  <dt>Highlights</dt>
                  <dd>{intake.highlights}</dd>
                </>
              )}
            </dl>
          </article>

          <article className={`${styles.detailSection} surface-card`}>
            <h2>Branding</h2>
            <dl className={styles.kv}>
              <dt>Primary color</dt>
              <dd>
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: intake.primaryColor || '#fff',
                    border: '1px solid var(--border)',
                    verticalAlign: 'middle',
                    marginRight: 6,
                  }}
                />
                {intake.primaryColor || '—'}
              </dd>
              <dt>Secondary color</dt>
              <dd>
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: intake.secondaryColor || '#fff',
                    border: '1px solid var(--border)',
                    verticalAlign: 'middle',
                    marginRight: 6,
                  }}
                />
                {intake.secondaryColor || '—'}
              </dd>
              {intake.logoNotes && (
                <>
                  <dt>Logo notes</dt>
                  <dd>{intake.logoNotes}</dd>
                </>
              )}
            </dl>
          </article>

          <article className={`${styles.detailSection} surface-card`}>
            <h2>Delivery</h2>
            <dl className={styles.kv}>
              <dt>Package</dt>
              <dd>{intake.packageTier || '—'}</dd>
              <dt>Format</dt>
              <dd>{intake.formats}</dd>
              {intake.musicStyle && (
                <>
                  <dt>Music style</dt>
                  <dd>{intake.musicStyle}</dd>
                </>
              )}
              <dt>Voiceover</dt>
              <dd>{intake.voiceover ? 'Yes (+$40)' : 'No'}</dd>
              {intake.deadline && (
                <>
                  <dt>Deadline</dt>
                  <dd>{intake.deadline}</dd>
                </>
              )}
            </dl>
          </article>

          {intake.notes && (
            <article className={`${styles.detailSection} surface-card`}>
              <h2>Notes</h2>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{intake.notes}</p>
            </article>
          )}
        </div>
      </section>
    </main>
  )
}
