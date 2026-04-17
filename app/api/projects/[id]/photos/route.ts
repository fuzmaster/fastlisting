import { NextResponse } from 'next/server'
import { updateProject } from '@/lib/db/projects'
import { PhotoItem } from '@/lib/types'
import { Prisma } from '@prisma/client'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const body = await request.json().catch(() => null)
  const photos: PhotoItem[] = body?.photos

  if (!photos || !Array.isArray(photos)) {
    return NextResponse.json({ error: 'photos array is required' }, { status: 400 })
  }

const project = await updateProject(id, { photos: photos as unknown as Prisma.InputJsonValue })
  return NextResponse.json(project)
}
