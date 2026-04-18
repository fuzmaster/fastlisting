import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'
import { getUserById, updateUser } from '@/lib/db/users'

const checkoutSchema = z.object({
  priceId: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
    }

    const user = await getUserById(session.user.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email })
      customerId = customer.id
      await updateUser(session.user.id, { stripeCustomerId: customerId })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: parsed.data.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { userId: session.user.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch {
    return NextResponse.json({ error: 'Unable to start checkout' }, { status: 500 })
  }
}
