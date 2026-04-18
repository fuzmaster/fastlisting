import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPresignedUploadUrl } from '@/lib/s3'

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

  const key = `projects/${projectId}/originals/${filename}`
  const uploadUrl = await getPresignedUploadUrl(key, contentType)

  return NextResponse.json({ uploadUrl, key })
}
