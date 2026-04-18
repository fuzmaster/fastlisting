import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateBrandPreset } from '@/lib/db/brand-presets'
import { prisma } from '@/lib/prisma'
import { brandPresetPatchSchema } from '@/lib/validation'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json().catch(() => null)
    const parsed = brandPresetPatchSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

    const existing = await prisma.brandPreset.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Preset not found' }, { status: 404 })
    }

    const preset = await updateBrandPreset(id, parsed.data)
    return NextResponse.json(preset)
  } catch {
    return NextResponse.json({ error: 'Failed to update preset' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.brandPreset.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Preset not found' }, { status: 404 })
    }

    await prisma.brandPreset.delete({ where: { id } })
    return NextResponse.json({ deleted: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete preset' }, { status: 500 })
  }
}
