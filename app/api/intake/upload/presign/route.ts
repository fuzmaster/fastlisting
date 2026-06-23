import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getPresignedUploadUrl } from '@/lib/s3'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'video/mov',
  'video/webm',
])

const MAX_BYTES = 500 * 1024 * 1024

const schema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(120),
  size: z.number().int().min(1).max(MAX_BYTES),
  draftId: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
})

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 })
  }

  const { filename, contentType, draftId } = parsed.data
  if (!ALLOWED_TYPES.has(contentType.toLowerCase())) {
    return NextResponse.json(
      { error: 'Unsupported file type. Use JPG, PNG, HEIC, MP4, or MOV.' },
      { status: 400 }
    )
  }

  const safeName = sanitizeFilename(filename)
  const key = `intakes/${draftId}/${Date.now()}-${safeName}`

  try {
    const uploadUrl = await getPresignedUploadUrl(key, contentType)
    return NextResponse.json({ uploadUrl, key })
  } catch (err) {
    console.error('[intake/upload/presign] failed', err)
    return NextResponse.json({ error: 'Unable to prepare upload.' }, { status: 500 })
  }
}
