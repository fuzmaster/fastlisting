import { User } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type UserUpdateData = Partial<
  Pick<
    User,
    'email' | 'passwordHash' | 'stripeCustomerId' | 'planTier' | 'monthlyUsage' | 'billingCycleEnd'
  >
>

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export function createUser(email: string, passwordHash?: string) {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  })
}

export function updateUser(id: string, data: UserUpdateData) {
  return prisma.user.update({
    where: { id },
    data,
  })
}
