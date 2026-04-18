import { getUserById, updateUser } from '@/lib/db/users'
import { PLAN_LIMITS } from '@/lib/constants'

export async function checkUsageAllowed(userId: string): Promise<void> {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  const limit = PLAN_LIMITS[user.planTier as keyof typeof PLAN_LIMITS] ?? 1
  if (user.monthlyUsage >= limit) throw new Error(`Monthly limit of ${limit} renders reached. Please upgrade.`)
}

export async function incrementUsage(userId: string): Promise<void> {
  const user = await getUserById(userId)
  if (!user) return

  const now = new Date()
  const needsReset = user.billingCycleEnd ? now > user.billingCycleEnd : true

  const nextCycleEnd = new Date()
  nextCycleEnd.setMonth(nextCycleEnd.getMonth() + 1)

  await updateUser(userId, {
    monthlyUsage: needsReset ? 1 : user.monthlyUsage + 1,
    billingCycleEnd: needsReset ? nextCycleEnd : user.billingCycleEnd ?? nextCycleEnd,
  })
}
