'use client'

import { useState, useEffect, useRef } from 'react'
import { Project } from '@prisma/client'
import { Player } from '@remotion/player'
import { PhotoItem } from '@/lib/types'
import { ListingVideo } from '@/remotion/compositions/ListingVideo'

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? ''
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION ?? 'us-east-1'

function getS3Url(key: string) {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`
}

interface ProjectEditorProps {
  project: Project
  userId: string
}

interface RenderResult {
  renderId16x9: string
  renderId9x16: string
  bucketName: string
}

interface RenderStatus {
  done: boolean
  outputFile: string | null
  overallProgress: number
  errors: unknown[]
}

export function ProjectEditor({ project, userId }: ProjectEditorProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(
    (project.photos as unknown as PhotoItem[]) ?? []
  )
  const [address, setAddress] = useState(project.address ?? '')
  const [price, setPrice] = useState(project.price ?? '')
  const [beds, setBeds] = useState(project.beds ?? '')
  const [baths, setBaths] = useState(project.baths ?? '')
  const [presets, setPresets] = useState<{ id: string; name: string }[]>([])
  const [brandPresetId, setBrandPresetId] = useState(project.brandPresetId ?? '')
  const [newPresetName, setNewPresetName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [generateMessage, setGenerateMessage] = useState('')
  const [renderProgress, setRenderProgress] = useState(0)
  const [downloadUrls, setDownloadUrls] = useState<{ url16x9: string | null; url9x16: string | null }>({
    url16x9: project.video16x9Url ?? null,
    url9x16: project.video9x16Url ?? null,
  })

  const pollRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch(`/api/brand-presets?userId=${userId}`)
      .then((r) => r.json())
      .then(setPresets)
      .catch(() => {})
  }, [userId])

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  async function pollRenderStatus(renderResult: RenderResult) {
    let attempts = 0
    const maxAttempts = 60 // 5 min max

    pollRef.current = setInterval(async () => {
      attempts++
      if (attempts > maxAttempts) {
        stopPolling()
        setGenerateMessage('Render timed out. Check back later.')
        setGenerating(false)
        return
      }

      try {
        const [res16x9, res9x16] = await Promise.all([
          fetch(`/api/render/status/${renderResult.renderId16x9}?bucketName=${renderResult.bucketName}`),
          fetch(`/api/render/status/${renderResult.renderId9x16}?bucketName=${renderResult.bucketName}`),
        ])

        const status16x9: RenderStatus = await res16x9.json()
        const status9x16: RenderStatus = await res9x16.json()

        const avgProgress = ((status16x9.overallProgress ?? 0) + (status9x16.overallProgress ?? 0)) / 2
        setRenderProgress(Math.round(avgProgress * 100))

        if (status16x9.done && status9x16.done) {
          stopPolling()
          setGenerating(false)
          setRenderProgress(100)
          setGenerateMessage('Renders complete!')

          const url16x9 = status16x9.outputFile ?? null
          const url9x16 = status9x16.outputFile ?? null

          setDownloadUrls({ url16x9, url9x16 })

          // Save to project
          if (url16x9 || url9x16) {
            await fetch(`/api/projects/${project.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                video16x9Url: url16x9,
                video9x16Url: url9x16,
                status: 'COMPLETED',
              }),
            })
          }
        }
      } catch {
        // keep polling
      }
    }, 5000)
  }

  async function savePhotos(updated: PhotoItem[]) {
    await fetch(`/api/projects/${project.id}/photos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: updated }),
    })
  }

  async function saveField(field: string, value: string) {
    await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadStatus(`Uploading ${files.length} photo(s)...`)
    const newPhotos = [...photos]

    for (const file of files) {
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, projectId: project.id }),
      })
      const { uploadUrl, key } = await presignRes.json()
      await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      const photoId = crypto.randomUUID()
      const proxyRes = await fetch('/api/upload/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highResKey: key, projectId: project.id, photoId }),
      })
      const { proxyKey } = await proxyRes.json()
      newPhotos.push({ id: photoId, highResKey: key, proxyKey, focusX: 50, focusY: 50 })
    }

    setPhotos(newPhotos)
    await savePhotos(newPhotos)
    setUploadStatus(`${newPhotos.length} photo(s) ready.`)
  }

  function movePhoto(index: number, direction: 'up' | 'down') {
    const updated = [...photos]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= updated.length) return
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setPhotos(updated)
    savePhotos(updated)
  }

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index)
    setPhotos(updated)
    savePhotos(updated)
  }

  async function createPreset() {
    if (!newPresetName.trim()) return
    const res = await fetch('/api/brand-presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name: newPresetName.trim() }),
    })
    const preset = await res.json()
    setPresets((prev) => [...prev, preset])
    setNewPresetName('')
  }

  async function handleGenerate() {
    setGenerating(true)
    setGenerateMessage('Starting renders...')
    setRenderProgress(0)
    setDownloadUrls({ url16x9: null, url9x16: null })
    stopPolling()

    const res = await fetch('/api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id }),
    })
    const data = await res.json()

    if (!res.ok) {
      setGenerateMessage(data.error ?? 'Render failed.')
      setGenerating(false)
      return
    }

    setGenerateMessage('Rendering... this takes 2-4 minutes.')
    pollRenderStatus(data)
  }

  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#141414',
    border: '1px solid #262626',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#1A1A1A',
    border: '1px solid #262626',
    borderRadius: 6,
    color: '#F5F5F5',
    fontSize: 14,
    outline: 'none',
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 4 }}>{address || 'Untitled Project'}</h1>
        <p style={{ color: '#888888', fontSize: 14 }}>Project Editor</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div>

          {/* PHOTOS */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: 16, marginTop: 0 }}>Photos</h2>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #262626',
              borderRadius: 6,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: 12,
            }}>
              + Add Photos
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
            {uploadStatus && <p style={{ fontSize: 13, color: '#888888', marginBottom: 12 }}>{uploadStatus}</p>}
            {photos.length === 0 ? (
              <p style={{ fontSize: 13, color: '#888888', padding: '24px 0', textAlign: 'center' }}>
                No photos yet. Add photos to get started.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {photos.map((photo, index) => (
                  <div key={photo.id} style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                    <img
                      src={getS3Url(photo.proxyKey)}
                      alt={`Photo ${index + 1}`}
                      style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: 2, padding: 4, backgroundColor: 'rgba(0,0,0,0.6)' }}>
                      <button type="button" onClick={() => movePhoto(index, 'up')} style={{ flex: 1, padding: '3px 0', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#F5F5F5', borderRadius: 3 }}>↑</button>
                      <button type="button" onClick={() => movePhoto(index, 'down')} style={{ flex: 1, padding: '3px 0', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#F5F5F5', borderRadius: 3 }}>↓</button>
                      <button type="button" onClick={() => removePhoto(index)} style={{ flex: 1, padding: '3px 0', fontSize: 11, backgroundColor: 'rgba(239,68,68,0.3)', border: 'none', color: '#FCA5A5', borderRadius: 3 }}>✕</button>
                    </div>
                    <div style={{ position: 'absolute', top: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', color: '#888888', fontSize: 11, padding: '2px 5px', borderRadius: 3 }}>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LISTING INFO */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: 16, marginTop: 0 }}>Listing Info</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Address</label>
              <input style={inputStyle} type="text" value={address} onChange={(e) => setAddress(e.target.value)} onBlur={() => saveField('address', address)} placeholder="123 Main St, City, State" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Price</label>
                <input style={inputStyle} type="text" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={() => saveField('price', price)} placeholder="850,000" />
              </div>
              <div>
                <label style={labelStyle}>Beds</label>
                <input style={inputStyle} type="text" value={beds} onChange={(e) => setBeds(e.target.value)} onBlur={() => saveField('beds', beds)} placeholder="4" />
              </div>
              <div>
                <label style={labelStyle}>Baths</label>
                <input style={inputStyle} type="text" value={baths} onChange={(e) => setBaths(e.target.value)} onBlur={() => saveField('baths', baths)} placeholder="2.5" />
              </div>
            </div>
          </div>

          {/* BRAND PRESET */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: 16, marginTop: 0 }}>Brand Preset</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Select Preset</label>
              <select style={inputStyle} value={brandPresetId} onChange={(e) => { setBrandPresetId(e.target.value); saveField('brandPresetId', e.target.value) }}>
                <option value="">-- Select a preset --</option>
                {presets.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} type="text" placeholder="New preset name" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createPreset()} />
              <button type="button" onClick={createPreset} style={{ padding: '8px 16px', backgroundColor: '#1A1A1A', border: '1px solid #262626', color: '#F5F5F5', borderRadius: 6, fontSize: 13, whiteSpace: 'nowrap' }}>Create</button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ position: 'sticky', top: 72 }}>

          {/* PREVIEW */}
          <div style={{ ...sectionStyle, marginBottom: 16 }}>
            <h2 style={{ marginBottom: 12, marginTop: 0 }}>Preview</h2>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 6, overflow: 'hidden' }}>
              <Player
                component={ListingVideo}
                inputProps={{ photos, address }}
                durationInFrames={150}
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{ width: '100%', height: '100%' }}
                controls={false}
                acknowledgeRemotionLicense
              />
            </div>
            <p style={{ fontSize: 12, color: '#888888', marginTop: 8 }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} · 16:9 preview
            </p>
          </div>

          {/* GENERATE */}
          <div style={sectionStyle}>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={photos.length === 0 || generating}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: photos.length === 0 || generating ? '#1A1A1A' : '#E8D5B7',
                color: photos.length === 0 || generating ? '#888888' : '#0A0A0A',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {generating ? `Rendering... ${renderProgress}%` : 'Generate Video'}
            </button>

            {photos.length === 0 && (
              <p style={{ fontSize: 12, color: '#888888', marginTop: 8, textAlign: 'center' }}>Add photos to enable rendering</p>
            )}

            {/* Progress bar */}
            {generating && renderProgress > 0 && (
              <div style={{ marginTop: 12, backgroundColor: '#1A1A1A', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#E8D5B7', width: `${renderProgress}%`, transition: 'width 0.5s ease' }} />
              </div>
            )}

            {generateMessage && (
              <p style={{ fontSize: 13, color: generateMessage.includes('complete') ? '#86EFAC' : generateMessage.includes('failed') || generateMessage.includes('timed') ? '#FCA5A5' : '#888888', marginTop: 8, textAlign: 'center' }}>
                {generateMessage}
              </p>
            )}

            {/* DOWNLOAD LINKS */}
            {(downloadUrls.url16x9 || downloadUrls.url9x16) && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #262626' }}>
                <p style={{ fontSize: 12, color: '#888888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Downloads</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {downloadUrls.url16x9 && (
                    <a
                      href={downloadUrls.url16x9}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #262626',
                        borderRadius: 6,
                        fontSize: 13,
                        color: '#E8D5B7',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      ↓ Download 16:9 (Landscape)
                    </a>
                  )}
                  {downloadUrls.url9x16 && (
                    <a
                      href={downloadUrls.url9x16}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #262626',
                        borderRadius: 6,
                        fontSize: 13,
                        color: '#E8D5B7',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      ↓ Download 9:16 (Vertical)
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
