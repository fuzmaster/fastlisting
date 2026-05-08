import { NextResponse } from 'next/server'
import { getRenderProgress } from '@remotion/lambda/client'
import { auth } from '@/auth'
import { getProjectById } from '@/lib/db/projects'

const FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME ?? ''
const REGION = 'us-east-1' as const

export async function GET(
  request: Request,
  { params }: { params: Promise<{ renderId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { renderId } = await params
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId') ?? ''
  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  const project = await getProjectById(projectId)
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const isKnownRenderId = renderId === project.renderId16x9 || renderId === project.renderId9x16
  if (!isKnownRenderId) {
    return NextResponse.json({ error: 'Render not found' }, { status: 404 })
  }

  if (!project.renderBucketName) {
    return NextResponse.json({ error: 'Render bucket not available' }, { status: 404 })
  }

  const progress = await getRenderProgress({
    renderId,
    bucketName: project.renderBucketName,
    functionName: FUNCTION_NAME,
    region: REGION,
  })

  return NextResponse.json({
    done: progress.done,
    outputFile: progress.outputFile,
    overallProgress: progress.overallProgress,
    errors: progress.errors,
  })
}
