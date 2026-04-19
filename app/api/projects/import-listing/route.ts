import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getProjectById, updateProject } from '@/lib/db/projects'
import { listingImportSchema } from '@/lib/validation'

type JsonLdNode = Record<string, unknown>

function normalizeText(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function flattenJsonLd(input: unknown): JsonLdNode[] {
  if (!input) return []
  if (Array.isArray(input)) return input.flatMap(flattenJsonLd)
  if (typeof input !== 'object') return []

  const node = input as Record<string, unknown>
  if (Array.isArray(node['@graph'])) {
    return [...flattenJsonLd(node['@graph']), node]
  }

  return [node]
}

function getTypeList(node: JsonLdNode) {
  const rawType = node['@type']
  if (Array.isArray(rawType)) return rawType.map(String)
  if (rawType) return [String(rawType)]
  return []
}

function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return normalizeText(value)
  }
  return ''
}

function toAddressString(value: unknown) {
  if (!value) return ''
  if (typeof value === 'string') return normalizeText(value)
  if (typeof value !== 'object') return ''

  const address = value as Record<string, unknown>
  return [
    pickFirstString(address.streetAddress),
    pickFirstString(address.addressLocality),
    pickFirstString(address.addressRegion),
    pickFirstString(address.postalCode),
  ]
    .filter(Boolean)
    .join(', ')
}

function extractNumberString(patterns: RegExp[], text: string) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1]
  }
  return ''
}

function uniqueNonEmpty(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function extractListingData(html: string, source: string) {
  const normalizedHtml = normalizeText(html)
  const scriptMatches = Array.from(
    html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  )

  const jsonLdNodes = scriptMatches.flatMap((match) => {
    const raw = match[1]?.trim()
    if (!raw) return []

    try {
      return flattenJsonLd(JSON.parse(raw))
    } catch {
      return []
    }
  })

  const listingNode =
    jsonLdNodes.find((node) =>
      getTypeList(node).some((type) =>
        /(Residence|Apartment|House|SingleFamilyResidence|Product|Offer|Accommodation)/i.test(type)
      )
    ) ?? null

  const addressCandidates = uniqueNonEmpty([
    toAddressString(listingNode?.address),
    pickFirstString(listingNode?.name),
    pickFirstString(listingNode?.headline),
    pickFirstString(normalizedHtml.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]),
    pickFirstString(normalizedHtml.match(/<title>([^<]+)<\/title>/i)?.[1]),
  ])

  const priceCandidates = uniqueNonEmpty([
    pickFirstString((listingNode?.offers as Record<string, unknown> | undefined)?.price),
    pickFirstString(listingNode?.price),
    pickFirstString(normalizedHtml.match(/\$([\d,]+(?:\.\d{2})?)/)?.[1]),
  ])

  const bodyText = normalizeText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )

  const beds = extractNumberString(
    [
      /(\d+(?:\.\d+)?)\s*(?:bd|beds?|bedrooms?)/i,
      /"numberOfBedrooms"\s*:\s*"?(\\?[\d.]+)"?/i,
      /"beds?"\s*:\s*"?(\\?[\d.]+)"?/i,
    ],
    bodyText
  )

  const baths = extractNumberString(
    [
      /(\d+(?:\.\d+)?)\s*(?:ba|baths?|bathrooms?)/i,
      /"numberOfBathroomsTotal"\s*:\s*"?(\\?[\d.]+)"?/i,
      /"baths?"\s*:\s*"?(\\?[\d.]+)"?/i,
    ],
    bodyText
  )

  const address =
    addressCandidates.find((candidate) => candidate.length > 10 && !candidate.includes('|')) ??
    addressCandidates[0] ??
    ''

  const price = priceCandidates[0]?.replace(/[^\d.,]/g, '') ?? ''

  return {
    address,
    price,
    beds,
    baths,
    source,
  }
}

function extractListingDataFromText(text: string) {
  const normalizedText = normalizeText(text)
  const lines = normalizedText
    .split(/[\n|]/)
    .map((line) => normalizeText(line))
    .filter(Boolean)

  const address =
    lines.find((line) => /\d{2,} .+/.test(line) && /[A-Za-z]/.test(line)) ??
    ''

  const priceMatch = normalizedText.match(/\$([\d,]+(?:\.\d{2})?)/)
  const beds = extractNumberString([/(\d+(?:\.\d+)?)\s*(?:bd|beds?|bedrooms?)/i], normalizedText)
  const baths = extractNumberString([/(\d+(?:\.\d+)?)\s*(?:ba|baths?|bathrooms?)/i], normalizedText)

  return {
    address,
    price: priceMatch?.[1] ?? '',
    beds,
    baths,
    source: 'pasted-text',
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const parsed = listingImportSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid listing source' }, { status: 400 })
    }

    const project = await getProjectById(parsed.data.projectId)
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const extracted = parsed.data.source
      ? await (async () => {
          const response = await fetch(parsed.data.source!, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; FastListingBot/1.0)',
              Accept: 'text/html,application/xhtml+xml',
            },
            cache: 'no-store',
          })

          if (!response.ok) {
            throw new Error('FETCH_FAILED')
          }

          const html = await response.text()
          return extractListingData(html, parsed.data.source!)
        })()
      : extractListingDataFromText(parsed.data.pastedText ?? '')

    if (!extracted.address && !extracted.price && !extracted.beds && !extracted.baths) {
      return NextResponse.json(
        { error: 'No listing details were detected on that page' },
        { status: 422 }
      )
    }

    const updatedProject = await updateProject(project.id, {
      ...(extracted.address ? { address: extracted.address } : {}),
      ...(extracted.price ? { price: extracted.price } : {}),
      ...(extracted.beds ? { beds: extracted.beds } : {}),
      ...(extracted.baths ? { baths: extracted.baths } : {}),
    })

    return NextResponse.json({
      project: updatedProject,
      imported: extracted,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'FETCH_FAILED') {
      return NextResponse.json({ error: 'Could not fetch listing page' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to import listing' }, { status: 500 })
  }
}
