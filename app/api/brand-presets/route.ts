import { NextResponse } from 'next/server'

import { createBrandPreset, getBrandPresetsByUserId } from '@/lib/db/brand-presets'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const presets = await getBrandPresetsByUserId(userId)
  return NextResponse.json(presets)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const userId = body?.userId
  const name = body?.name

  if (!userId || !name) {
    return NextResponse.json({ error: 'userId and name are required' }, { status: 400 })
  }

  const preset = await createBrandPreset(userId, name)
  return NextResponse.json(preset)
}
