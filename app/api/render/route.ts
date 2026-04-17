import { NextResponse } from 'next/server'
import { renderMediaOnLambda } from '@remotion/lambda/client'
import { getProjectById, updateProject } from '@/lib/db/projects'
import { getBrandPresetById } from '@/lib/db/brand-presets'
import { checkUsageAllowed, incrementUsage } from '@/lib/usage'
import { PhotoItem } from '@/lib/types'

const SERVE_URL = process.env.REMOTION_SERVE_URL ?? ''
const FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME ?? ''
const REGION = 'us-east-1' as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const projectId = body?.projectId

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  const project = await getProjectById(projectId)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  try {
    await checkUsageAllowed(project.userId)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Usage check failed'
    return NextResponse.json({ error: errorMessage }, { status: 403 })
  }

  // Load brand preset if set
  const brandPreset = project.brandPresetId
    ? await getBrandPresetById(project.brandPresetId)
    : null

  const photos = (project.photos as unknown as PhotoItem[]) ?? []

  const inputProps = {
    photos,
    address: project.address ?? '',
    price: project.price ?? '',
    beds: project.beds ?? '',
    baths: project.baths ?? '',
    audioTrackId: project.audioTrackId ?? 'track_1',
    brandPresetId: project.brandPresetId ?? '',
    agentName: brandPreset?.agentName ?? '',
    brokerageName: brandPreset?.brokerageName ?? '',
    primaryColor: brandPreset?.primaryColor ?? '#E8D5B7',
  }

  await updateProject(projectId, { status: 'RENDERING' })

  const render16x9 = await renderMediaOnLambda({
    region: REGION,
    functionName: FUNCTION_NAME,
    serveUrl: SERVE_URL,
    composition: 'ListingVideo',
    inputProps: { ...inputProps, aspectRatio: '16:9' },
    codec: 'h264',
    downloadBehavior: { type: 'play-in-browser' },
  })

  const render9x16 = await renderMediaOnLambda({
    region: REGION,
    functionName: FUNCTION_NAME,
    serveUrl: SERVE_URL,
    composition: 'ListingVideo',
    inputProps: { ...inputProps, aspectRatio: '9:16' },
    codec: 'h264',
    downloadBehavior: { type: 'play-in-browser' },
  })

  await incrementUsage(project.userId)

  return NextResponse.json({
    message: 'Renders started',
    renderId16x9: render16x9.renderId,
    renderId9x16: render9x16.renderId,
    bucketName: render16x9.bucketName,
  })
}
