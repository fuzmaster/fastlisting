import { NextResponse } from 'next/server'
import { renderMediaOnLambda } from '@remotion/lambda/client'
import { auth } from '@/auth'
import { getProjectById, updateProject } from '@/lib/db/projects'
import { getBrandPresetById } from '@/lib/db/brand-presets'
import { checkUsageAllowed, incrementUsage } from '@/lib/usage'
import { PhotoItem } from '@/lib/types'
import { renderRequestSchema } from '@/lib/validation'

const SERVE_URL = process.env.REMOTION_SERVE_URL ?? ''
const FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME ?? ''
const REGION = 'us-east-1' as const

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const parsed = renderRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    const project = await getProjectById(parsed.data.projectId)
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    try {
      await checkUsageAllowed(project.userId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Usage check failed'
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

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
      secondaryColor: brandPreset?.secondaryColor ?? '#ffffff',
      logoKey: brandPreset?.logoKey ?? '',
      headshotKey: brandPreset?.headshotKey ?? '',
      styleMode: parsed.data.styleMode ?? 'cinematic',
    }

    await updateProject(project.id, { status: 'RENDERING' })

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
  } catch {
    return NextResponse.json({ error: 'Failed to start render' }, { status: 500 })
  }
}
