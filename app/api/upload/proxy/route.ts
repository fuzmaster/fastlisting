import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import sharp from 'sharp'
import { getProjectById } from '@/lib/db/projects'
import { getS3ObjectBuffer, s3 } from '@/lib/s3'

const SAFE_PHOTO_ID_MAX_LENGTH = 64
const SAFE_PHOTO_ID_REGEX = new RegExp(`^[a-zA-Z0-9_-]{1,${SAFE_PHOTO_ID_MAX_LENGTH}}$`)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

  if (!UUID_REGEX.test(projectId)) {
    return NextResponse.json({ error: 'Invalid projectId' }, { status: 400 })
  }

  const project = await getProjectById(projectId)
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const expectedPrefix = `projects/${projectId}/originals/`
  if (!String(highResKey).startsWith(expectedPrefix)) {
    return NextResponse.json({ error: 'Invalid highResKey for project' }, { status: 400 })
  }

  const isUuid = typeof photoId === 'string' && UUID_REGEX.test(photoId)
  const isSafeId = typeof photoId === 'string' && SAFE_PHOTO_ID_REGEX.test(photoId)
  if (!isUuid && !isSafeId) {
    return NextResponse.json({ error: 'photoId must be a UUID or safe identifier' }, { status: 400 })
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
