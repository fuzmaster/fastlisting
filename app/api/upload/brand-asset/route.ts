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
  const kind = body?.kind

  if (!filename || !contentType || (kind !== 'logo' && kind !== 'headshot')) {
    return NextResponse.json(
      { error: 'filename, contentType, and a valid kind are required' },
      { status: 400 }
    )
  }

  const sanitizedName = String(filename).replace(/[^a-zA-Z0-9._-]/g, '-')
  const extension = sanitizedName.includes('.') ? sanitizedName.split('.').pop() : 'bin'
  const key = `brand-assets/${session.user.id}/${kind}-${crypto.randomUUID()}.${extension}`
  const uploadUrl = await getPresignedUploadUrl(key, contentType)

  return NextResponse.json({ uploadUrl, key })
}
