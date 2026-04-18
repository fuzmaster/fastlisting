import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getProjectById } from '@/lib/db/projects'
import { getUserById } from '@/lib/db/users'
import { PLAN_LIMITS } from '@/lib/constants'
import { ProjectEditor } from './ProjectEditor'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const [project, user] = await Promise.all([
    getProjectById(id),
    getUserById(session.user.id),
  ])

  if (!project) {
    return (
      <main style={{ padding: 24 }}>
        <p style={{ color: '#888888' }}>Project not found.</p>
      </main>
    )
  }

  if (project.userId !== session.user.id) {
    redirect('/dashboard')
  }

  const planTier = (user?.planTier ?? 'FREE') as keyof typeof PLAN_LIMITS
  const limit = PLAN_LIMITS[planTier] ?? 0
  const used = user?.monthlyUsage ?? 0
  const remaining = Math.max(0, limit - used)

  return (
    <main>
      <ProjectEditor
        project={project}
        rendersRemaining={remaining}
        planTier={planTier}
      />
    </main>
  )
}
