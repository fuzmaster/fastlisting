import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getProjectById, updateProject } from '@/lib/db/projects'
import { projectIdSchema } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const parsed = projectIdSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'projectId required' }, { status: 400 })
    }

    const project = await getProjectById(parsed.data.projectId)
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updated = await updateProject(project.id, { status: 'DRAFT' })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to reset render state' }, { status: 500 })
  }
}
