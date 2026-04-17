export const PLAN_TIERS = {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PRO: 'PRO',
} as const

export const RENDER_STATUS = {
  DRAFT: 'DRAFT',
  RENDERING: 'RENDERING',
  COMPLETED: 'COMPLETED',
} as const

export const AUDIO_TRACKS = [
  { id: 'track_1', label: 'Track 1' },
  { id: 'track_2', label: 'Track 2' },
  { id: 'track_3', label: 'Track 3' },
] as const

export const PLAN_LIMITS = {
  FREE: 0,
  STARTER: 15,
  PRO: 50,
} as const