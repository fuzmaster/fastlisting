type IntakePayload = {
  id: string
  contactName: string
  contactEmail: string
  contactPhone?: string | null
  brokerageName?: string | null
  propertyAddress?: string | null
  mediaLink: string
  packageTier?: string | null
  deadline?: string | null
  uploadedFileCount?: number
}

export async function notifyNewIntake(intake: IntakePayload) {
  const url = process.env.INTAKE_WEBHOOK_URL
  if (!url) return

  const summary = [
    `**New listing video request**`,
    `From: ${intake.contactName} <${intake.contactEmail}>${intake.contactPhone ? ` · ${intake.contactPhone}` : ''}`,
    intake.brokerageName ? `Brokerage: ${intake.brokerageName}` : null,
    intake.propertyAddress ? `Property: ${intake.propertyAddress}` : null,
    intake.packageTier ? `Package: ${intake.packageTier}` : null,
    intake.deadline ? `Deadline: ${intake.deadline}` : null,
    intake.uploadedFileCount ? `Direct uploads: ${intake.uploadedFileCount} file(s)` : null,
    `Media: ${intake.mediaLink}`,
    `Intake ID: ${intake.id}`,
  ]
    .filter(Boolean)
    .join('\n')

  const body = JSON.stringify({
    content: summary,
    text: summary,
  })

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })
  } catch (err) {
    console.error('[notify] webhook delivery failed', err)
  }
}
