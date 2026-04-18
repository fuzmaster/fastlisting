import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { auth } from '@/auth'
import { getProjectById, updateProject } from '@/lib/db/projects'
import { photosPatchSchema } from '@/lib/validation'

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
    const parsed = photosPatchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'photos array is required' }, { status: 400 })
    }

    const project = await getProjectById(id)
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updated = await updateProject(id, {
      photos: parsed.data.photos as unknown as Prisma.InputJsonValue,
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update photos' }, { status: 500 })
  }
}
