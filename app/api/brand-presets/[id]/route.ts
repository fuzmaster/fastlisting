import { NextResponse } from 'next/server'
import { updateBrandPreset } from '@/lib/db/brand-presets'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const allowed = ['name', 'agentName', 'brokerageName', 'primaryColor', 'secondaryColor', 'logoKey', 'headshotKey']
  const data: Record<string, string | null> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }

  const preset = await updateBrandPreset(id, data)
  return NextResponse.json(preset)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.brandPreset.delete({ where: { id } })
  return NextResponse.json({ deleted: true })
}
