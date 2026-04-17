import { BrandPreset } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type BrandPresetUpdateData = Partial<
  Pick<
    BrandPreset,
    | 'userId'
    | 'name'
    | 'agentName'
    | 'brokerageName'
    | 'logoKey'
    | 'headshotKey'
    | 'primaryColor'
    | 'secondaryColor'
  >
>

export function getBrandPresetById(id: string) {
  return prisma.brandPreset.findUnique({ where: { id } })
}

export function getBrandPresetsByUserId(userId: string) {
  return prisma.brandPreset.findMany({ where: { userId } })
}

export function createBrandPreset(userId: string, name: string) {
  return prisma.brandPreset.create({
    data: {
      userId,
      name,
    },
  })
}

export function updateBrandPreset(id: string, data: BrandPresetUpdateData) {
  return prisma.brandPreset.update({
    where: { id },
    data,
  })
}
