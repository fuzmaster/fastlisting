import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getProjectById } from '@/lib/db/projects'
import { ProjectEditor } from './ProjectEditor'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    return (
      <main style={{ padding: 24 }}>
        <p style={{ color: '#888888' }}>Project not found.</p>
      </main>
    )
  }

  return (
    <main>
      <ProjectEditor project={project} userId={session.user.id} />
    </main>
  )
}
