import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { intakeSchema } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = intakeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Some fields are missing or invalid.', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const intake = await prisma.intake.create({
      data: {
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        brokerageName: data.brokerageName || null,
        agentName: data.agentName || null,
        propertyAddress: data.propertyAddress || null,
        propertyPrice: data.propertyPrice || null,
        beds: data.beds || null,
        baths: data.baths || null,
        sqft: data.sqft || null,
        highlights: data.highlights || null,
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
        logoNotes: data.logoNotes || null,
        mediaLink: data.mediaLink,
        mediaNotes: data.mediaNotes || null,
        formats: data.formats,
        musicStyle: data.musicStyle || null,
        voiceover: data.voiceover,
        deadline: data.deadline || null,
        packageTier: data.packageTier || null,
        notes: data.notes || null,
      },
    })

    return NextResponse.json({ ok: true, id: intake.id })
  } catch (err) {
    console.error('[intake] failed', err)
    return NextResponse.json({ error: 'Unable to submit request.' }, { status: 500 })
  }
}
