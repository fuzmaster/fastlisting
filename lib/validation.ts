import { z } from 'zod'

export const projectIdSchema = z.object({
  projectId: z.string().uuid(),
})

export const renderRequestSchema = z.object({
  projectId: z.string().uuid(),
  styleMode: z.enum(['cinematic', 'social', 'minimal']).optional(),
})

export const projectPatchSchema = z
  .object({
    address: z.string().max(255).optional(),
    price: z.string().max(64).optional(),
    beds: z.string().max(16).optional(),
    baths: z.string().max(16).optional(),
    brandPresetId: z.string().uuid().nullable().optional(),
    audioTrackId: z.string().max(64).optional(),
    video16x9Url: z.string().url().nullable().optional(),
    video9x16Url: z.string().url().nullable().optional(),
    status: z.enum(['DRAFT', 'RENDERING', 'COMPLETED']).optional(),
  })
  .strict()

export const photosPatchSchema = z.object({
  photos: z
    .array(
      z.object({
        id: z.string(),
        highResKey: z.string(),
        proxyKey: z.string(),
        focusX: z.number().min(0).max(100),
        focusY: z.number().min(0).max(100),
      })
    )
    .max(30),
})

export const brandPresetCreateSchema = z.object({
  name: z.string().min(1).max(80),
  agentName: z.string().max(80).nullable().optional(),
  brokerageName: z.string().max(120).nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  logoKey: z.string().nullable().optional(),
  headshotKey: z.string().nullable().optional(),
})

export const brandPresetPatchSchema = z
  .object({
    name: z.string().min(1).max(80).optional(),
    agentName: z.string().max(80).nullable().optional(),
    brokerageName: z.string().max(120).nullable().optional(),
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
    logoKey: z.string().nullable().optional(),
    headshotKey: z.string().nullable().optional(),
  })
  .strict()

export const emailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export const intakeSchema = z.object({
  contactName: z.string().min(1).max(120),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(40).optional().or(z.literal('')),
  brokerageName: z.string().max(160).optional().or(z.literal('')),
  agentName: z.string().max(120).optional().or(z.literal('')),
  propertyAddress: z.string().max(255).optional().or(z.literal('')),
  propertyPrice: z.string().max(64).optional().or(z.literal('')),
  beds: z.string().max(16).optional().or(z.literal('')),
  baths: z.string().max(16).optional().or(z.literal('')),
  sqft: z.string().max(32).optional().or(z.literal('')),
  highlights: z.string().max(2000).optional().or(z.literal('')),
  primaryColor: z.string().max(32).optional().or(z.literal('')),
  secondaryColor: z.string().max(32).optional().or(z.literal('')),
  logoNotes: z.string().max(500).optional().or(z.literal('')),
  mediaLink: z.string().url().optional().or(z.literal('')),
  mediaNotes: z.string().max(1000).optional().or(z.literal('')),
  uploadedFiles: z
    .array(
      z.object({
        key: z.string().min(1).max(500),
        filename: z.string().min(1).max(255),
        size: z.number().int().min(0),
        contentType: z.string().min(1).max(120),
      })
    )
    .max(60)
    .default([]),
  formats: z.enum(['LANDSCAPE', 'VERTICAL', 'BOTH']).default('BOTH'),
  musicStyle: z.string().max(120).optional().or(z.literal('')),
  voiceover: z.boolean().default(false),
  deadline: z.string().max(64).optional().or(z.literal('')),
  packageTier: z.string().max(40).optional().or(z.literal('')),
  notes: z.string().max(2000).optional().or(z.literal('')),
}).refine(
  (data) => Boolean(data.mediaLink) || (data.uploadedFiles && data.uploadedFiles.length > 0),
  { message: 'Either upload files or paste a share link.', path: ['mediaLink'] }
)

export const listingImportSchema = z
  .object({
    projectId: z.string().uuid(),
    source: z.string().url().optional(),
    pastedText: z.string().max(10000).optional(),
  })
  .refine((data) => Boolean(data.source || data.pastedText?.trim()), {
    message: 'A source URL or pasted text is required',
  })
