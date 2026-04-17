import { User } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type UserUpdateData = Partial<
  Pick<
    User,
    'email' | 'stripeCustomerId' | 'planTier' | 'monthlyUsage' | 'billingCycleEnd'
  >
>

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export function createUser(email: string) {
  return prisma.user.create({
    data: {
      email,
    },
  })
}

export function updateUser(id: string, data: UserUpdateData) {
  return prisma.user.update({
    where: { id },
    data,
  })
}
