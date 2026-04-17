// DEV ONLY - remove before launch
'use client'

import { useState } from 'react'

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('Idle')

  async function handleUpload() {
    if (!file) {
      setStatus('Please select a file first.')
      return
    }

    setStatus('Requesting presigned URL...')

    try {
      const presignResponse = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          projectId: 'test-project-123',
        }),
      })

      if (!presignResponse.ok) {
        setStatus('Failed to get presigned URL.')
        return
      }

      const presignData: { uploadUrl: string; key: string } = await presignResponse.json()

      setStatus('Uploading original file...')

      const uploadResponse = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        setStatus('Failed to upload original file.')
        return
      }

      setStatus('Generating proxy image...')

      const photoId = crypto.randomUUID()
      const proxyResponse = await fetch('/api/upload/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          highResKey: presignData.key,
          projectId: 'test-project-123',
          photoId,
        }),
      })

      if (!proxyResponse.ok) {
        setStatus('Failed to generate proxy image.')
        return
      }

      const proxyData: { proxyKey: string } = await proxyResponse.json()

      console.log('highResKey:', presignData.key)
      console.log('proxyKey:', proxyData.proxyKey)

      setStatus('Upload complete. Check console for keys.')
    } catch {
      setStatus('Upload failed due to an unexpected error.')
    }
  }

  return (
    <main>
      <h1>Test Upload</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <button type="button" onClick={handleUpload}>
        Upload
      </button>
      <p>{status}</p>
    </main>
  )
}
