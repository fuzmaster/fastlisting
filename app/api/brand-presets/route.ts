import { NextResponse } from 'next/server'
import { auth } from '@/auth'

import { createBrandPreset, getBrandPresetsByUserId } from '@/lib/db/brand-presets'
import { brandPresetCreateSchema } from '@/lib/validation'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const presets = await getBrandPresetsByUserId(session.user.id)
    return NextResponse.json(presets)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch presets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const parsed = brandPresetCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid preset data' }, { status: 400 })
    }

    const preset = await createBrandPreset(session.user.id, parsed.data)
    return NextResponse.json(preset)
  } catch {
    return NextResponse.json({ error: 'Failed to create preset' }, { status: 500 })
  }
}
