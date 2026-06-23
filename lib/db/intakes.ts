import { prisma } from '@/lib/prisma'

export function listIntakes() {
  return prisma.intake.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export function getIntakeById(id: string) {
  return prisma.intake.findUnique({ where: { id } })
}

export function updateIntakeStatus(id: string, status: string) {
  return prisma.intake.update({
    where: { id },
    data: { status },
  })
}
