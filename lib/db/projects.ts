import { Prisma, Project } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type ProjectUpdateData = Partial<
  Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'photos'> & {
    photos: Prisma.InputJsonValue
  }
>

export function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } })
}

export function getProjectsByUserId(userId: string) {
  return prisma.project.findMany({ where: { userId } })
}

export function createProject(userId: string) {
  return prisma.project.create({
    data: {
      userId,
    },
  })
}

export function updateProject(id: string, data: ProjectUpdateData) {
  return prisma.project.update({
    where: { id },
    data,
  })
}
