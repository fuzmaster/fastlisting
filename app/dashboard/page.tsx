import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProjectsByUserId } from '@/lib/db/projects'
import { ProjectCard } from './ProjectCard'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const projects = await getProjectsByUserId(session.user.id)

  return (
    <main style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Projects</h1>
          <p style={{ color: '#888888', fontSize: 14, margin: 0 }}>
            {session.user.monthlyUsage ?? 0} renders used &middot; {session.user.planTier} plan
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#888888' }}>{session.user.email}</span>
          <NewProjectButton userId={session.user.id} />
        </div>
      </div>

      {projects.length === 0 ? (
        <div style={{
          padding: 48,
          backgroundColor: '#141414',
          border: '1px solid #262626',
          borderRadius: 8,
          textAlign: 'center',
          color: '#888888',
          fontSize: 14,
        }}>
          No projects yet. Click &quot;New Project&quot; to get started.
        </div>
      ) : (
        <div>
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              id={p.id}
              address={p.address}
              price={p.price}
              status={p.status}
            />
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
      <button type="submit" style={{
        padding: '8px 16px',
        backgroundColor: '#E8D5B7',
        color: '#0A0A0A',
        border: 'none',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
      }}>
        + New Project
      </button>
    </form>
  )
}
