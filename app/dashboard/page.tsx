import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProjectsByUserId } from '@/lib/db/projects'
import { getUserById } from '@/lib/db/users'
import { PLAN_LIMITS } from '@/lib/constants'
import { ProjectCard } from './ProjectCard'
import { ManageBillingButton } from './ManageBillingButton'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [projects, user] = await Promise.all([
    getProjectsByUserId(session.user.id),
    getUserById(session.user.id),
  ])

  const planTier = (user?.planTier ?? 'FREE') as keyof typeof PLAN_LIMITS
  const limit = PLAN_LIMITS[planTier] ?? 0
  const used = user?.monthlyUsage ?? 0
  const remaining = Math.max(0, limit - used)

  return (
    <main style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Projects</h1>
          <p style={{ color: '#888888', fontSize: 14, margin: 0 }}>{session.user.email}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Usage pill */}
          <div style={{
            padding: '6px 14px',
            backgroundColor: '#141414',
            border: '1px solid #262626',
            borderRadius: 6,
            fontSize: 13,
          }}>
            <span style={{ color: remaining === 0 ? '#FCA5A5' : remaining <= 3 ? '#FCD34D' : '#86EFAC', fontWeight: 600 }}>
              {remaining}
            </span>
            <span style={{ color: '#888888' }}> / {limit} renders left</span>
            <span style={{ color: '#555', marginLeft: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{planTier}</span>
          </div>

          {/* Billing */}
          {user?.stripeCustomerId ? (
            <ManageBillingButton userId={session.user.id} />
          ) : (
            <Link href="/pricing" style={{ padding: '7px 16px', backgroundColor: '#E8D5B7', color: '#0A0A0A', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Upgrade
            </Link>
          )}

          {/* New project */}
          <NewProjectButton userId={session.user.id} />
        </div>
      </div>

      {/* UPGRADE BANNER if at limit */}
      {remaining === 0 && limit > 0 && (
        <div style={{ marginBottom: 24, padding: '14px 20px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 14, color: '#FCA5A5', margin: 0 }}>
            You&apos;ve used all {limit} renders this month.
          </p>
          <Link href="/pricing" style={{ padding: '7px 16px', backgroundColor: '#E8D5B7', color: '#0A0A0A', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* FREE PLAN BANNER */}
      {planTier === 'FREE' && (
        <div style={{ marginBottom: 24, padding: '14px 20px', backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 14, color: '#888888', margin: 0 }}>
            You&apos;re on the free plan. Subscribe to start generating videos.
          </p>
          <Link href="/pricing" style={{ padding: '7px 16px', backgroundColor: '#E8D5B7', color: '#0A0A0A', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            See Plans
          </Link>
        </div>
      )}

      {/* PROJECT LIST */}
      {projects.length === 0 ? (
        <div style={{ padding: 48, backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, textAlign: 'center', color: '#888888', fontSize: 14 }}>
          No projects yet. Click &quot;New Project&quot; to get started.
        </div>
      ) : (
        <div>
          {projects.map(p => (
            <ProjectCard key={p.id} id={p.id} address={p.address} price={p.price} status={p.status} />
          ))}
        </div>
      )}
    </main>
  )
}

function NewProjectButton({ userId }: { userId: string }) {
  async function handleCreate() {
    'use server'
    const { createProject } = await import('@/lib/db/projects')
    const project = await createProject(userId)
    const { redirect } = await import('next/navigation')
    redirect(`/projects/${project.id}`)
  }

  return (
    <form action={handleCreate}>
      <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#E8D5B7', color: '#0A0A0A', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        + New Project
      </button>
    </form>
  )
}
