import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUserById, updateUser } from '@/lib/db/users'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const userId = body?.userId
  const priceId = body?.priceId

  if (!userId || !priceId) {
    return NextResponse.json({ error: 'userId and priceId are required' }, { status: 400 })
  }

  const user = await getUserById(userId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email })
    customerId = customer.id
    await updateUser(userId, { stripeCustomerId: customerId })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId },
  })

  return NextResponse.json({ url: session.url })
}
