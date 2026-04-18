import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUserByEmail, updateUser } from '@/lib/db/users'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature') ?? ''

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId
    if (!userId) return NextResponse.json({ received: true })

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const priceId = subscription.items.data[0]?.price.id

    const starterPriceId = process.env.STRIPE_STARTER_PRICE_ID
    const proPriceId = process.env.STRIPE_PRO_PRICE_ID

    const planTier = priceId === proPriceId ? 'PRO' : priceId === starterPriceId ? 'STARTER' : 'FREE'
    await updateUser(userId, { planTier })
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const customerId = subscription.customer as string
    const customer = await stripe.customers.retrieve(customerId)
    if ('email' in customer && customer.email) {
      const user = await getUserByEmail(customer.email)
      if (user) await updateUser(user.id, { planTier: 'FREE' })
    }
  }

  return NextResponse.json({ received: true })
}
