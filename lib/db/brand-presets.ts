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

export function createBrandPreset(
  userId: string,
  data: {
    name: string
    agentName?: string | null
    brokerageName?: string | null
    primaryColor?: string
    secondaryColor?: string | null
    logoKey?: string | null
    headshotKey?: string | null
  }
) {
  return prisma.brandPreset.create({
    data: {
      userId,
      name: data.name,
      agentName: data.agentName,
      brokerageName: data.brokerageName,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      logoKey: data.logoKey,
      headshotKey: data.headshotKey,
    },
  })
}

export function updateBrandPreset(id: string, data: BrandPresetUpdateData) {
  return prisma.brandPreset.update({
    where: { id },
    data,
  })
}
