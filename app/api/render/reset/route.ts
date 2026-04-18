import { NextResponse } from 'next/server'
import { updateProject } from '@/lib/db/projects'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const projectId = body?.projectId
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  const project = await updateProject(projectId, { status: 'DRAFT' })
  return NextResponse.json(project)
}
