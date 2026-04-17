import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

import { getS3ObjectBuffer, s3 } from '@/lib/s3'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const highResKey = body?.highResKey
  const projectId = body?.projectId
  const photoId = body?.photoId

  if (!highResKey || !projectId || !photoId) {
    return NextResponse.json(
      { error: 'highResKey, projectId, and photoId are required' },
      { status: 400 }
    )
  }

  const originalBuffer = await getS3ObjectBuffer(highResKey)

  const proxyBuffer = await sharp(originalBuffer)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  const proxyKey = `projects/${projectId}/proxies/${photoId}.webp`

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: proxyKey,
    Body: proxyBuffer,
    ContentType: 'image/webp',
  })

  await s3.send(command)

  return NextResponse.json({ proxyKey })
}
