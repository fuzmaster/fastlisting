import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'
import { getUserById } from '@/lib/db/users'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserById(session.user.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (!user.stripeCustomerId) {
      return NextResponse.json({ error: 'No billing account found. Please subscribe first.' }, { status: 400 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch {
    return NextResponse.json({ error: 'Unable to open billing portal' }, { status: 500 })
  }
}
