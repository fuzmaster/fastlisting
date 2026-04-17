import { NextResponse } from 'next/server'
import { getRenderProgress } from '@remotion/lambda/client'

const FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME ?? ''
const REGION = 'us-east-1' as const

export async function GET(
  request: Request,
  { params }: { params: Promise<{ renderId: string }> }
) {
  const { renderId } = await params
  const { searchParams } = new URL(request.url)
  const bucketName = searchParams.get('bucketName') ?? ''

  const progress = await getRenderProgress({
    renderId,
    bucketName,
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