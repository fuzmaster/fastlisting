import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'

import { createUser, getUserByEmail } from '@/lib/db/users'
import { emailPasswordSchema } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = emailPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email or password format.' }, { status: 400 })
    }

    const { email, password } = parsed.data
    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Account already exists.' }, { status: 409 })
    }

    const passwordHash = await hash(password, 12)
    await createUser(email, passwordHash)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unable to create account.' }, { status: 500 })
  }
}
