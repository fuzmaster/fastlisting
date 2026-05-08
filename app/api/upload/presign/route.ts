import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPresignedUploadUrl } from '@/lib/s3'
import { getProjectById } from '@/lib/db/projects'

const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_FILENAME_LENGTH = 100
const PROJECT_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function sanitizeFilename(filename: string) {
  const basename = filename.split('/').pop()?.split('\\').pop() ?? 'upload'
  const sanitized = basename
    .normalize('NFKC')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '')
    .slice(0, MAX_FILENAME_LENGTH)

  return sanitized || 'upload'
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const filename = body?.filename
  const contentType = body?.contentType
  const projectId = body?.projectId

  if (!filename || !contentType || !projectId) {
    return NextResponse.json(
      { error: 'filename, contentType, and projectId are required' },
      { status: 400 }
    )
  }

  if (!PROJECT_ID_REGEX.test(projectId)) {
    return NextResponse.json({ error: 'Invalid projectId' }, { status: 400 })
  }

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, and WEBP images are allowed' }, { status: 400 })
  }

  const project = await getProjectById(projectId)
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const safeFilename = sanitizeFilename(filename)
  const key = `projects/${projectId}/originals/${crypto.randomUUID()}-${safeFilename}`
  const uploadUrl = await getPresignedUploadUrl(key, contentType)

  return NextResponse.json({ uploadUrl, key })
}
