import { NextResponse } from 'next/server'
import { updateProject } from '@/lib/db/projects'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const allowed = ['address', 'price', 'beds', 'baths', 'brandPresetId', 'audioTrackId', 'video16x9Url', 'video9x16Url', 'status']
  const data: Record<string, string> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key]
  }

  const project = await updateProject(id, data)
  return NextResponse.json(project)
}
