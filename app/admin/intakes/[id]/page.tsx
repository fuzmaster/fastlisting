import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getIntakeById, updateIntakeStatus } from '@/lib/db/intakes'
import { getPresignedDownloadUrl } from '@/lib/s3'
import styles from '../page.module.css'

type UploadedFile = {
  key: string
  filename: string
  size: number
  contentType: string
}

function parseUploadedFiles(value: unknown): UploadedFile[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (v): v is UploadedFile =>
      typeof v === 'object' && v !== null && 'key' in v && 'filename' in v
  )
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

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

  const files = parseUploadedFiles(intake.uploadedFiles)
  const filesWithUrls = await Promise.all(
    files.map(async (f) => ({ ...f, url: await getPresignedDownloadUrl(f.key, 3600) }))
  )

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
            {filesWithUrls.length > 0 && (
              <div className={styles.fileList}>
                <p className="text-subtle" style={{ margin: '0 0 0.5rem', fontSize: '0.85rem' }}>
                  {filesWithUrls.length} direct upload{filesWithUrls.length === 1 ? '' : 's'} ·
                  download links valid for 1 hour
                </p>
                {filesWithUrls.map((f) => (
                  <a
                    key={f.key}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.fileItem}
                  >
                    <span className={styles.fileName}>{f.filename}</span>
                    <span className={styles.fileMeta}>{formatBytes(f.size)}</span>
                  </a>
                ))}
              </div>
            )}
            {intake.mediaLink && (
              <p style={{ marginTop: filesWithUrls.length ? '1rem' : 0 }}>
                <span className="text-subtle" style={{ fontSize: '0.85rem', display: 'block', marginBottom: 4 }}>
                  Cloud share link:
                </span>
                <a
                  className={styles.mediaLink}
                  href={intake.mediaLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {intake.mediaLink}
                </a>
              </p>
            )}
            {filesWithUrls.length === 0 && !intake.mediaLink && (
              <p className="text-subtle">No media attached.</p>
            )}
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
