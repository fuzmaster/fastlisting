import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUserById } from '@/lib/db/users'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const userId = body?.userId

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const user = await getUserById(userId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account found. Please subscribe first.' }, { status: 400 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
