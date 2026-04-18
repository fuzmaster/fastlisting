import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getProjectById, updateProject } from '@/lib/db/projects'
import { projectPatchSchema } from '@/lib/validation'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json().catch(() => null)
    const parsed = projectPatchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const project = await getProjectById(id)
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updated = await updateProject(id, parsed.data)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
