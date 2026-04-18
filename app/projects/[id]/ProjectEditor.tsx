'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Project } from '@prisma/client'
import { Player } from '@remotion/player'
import { PhotoItem } from '@/lib/types'
import { ListingVideo } from '@/remotion/compositions/ListingVideo'
import { AudioPicker } from './AudioPicker'

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? ''
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION ?? 'us-east-1'

function getS3Url(key: string) {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`
}

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s,]+/g, '-').replace(/-+/g, '-').trim()
}

interface ProjectEditorProps {
  project: Project
  userId: string
  rendersRemaining: number
  planTier: string
}
interface RenderResult { renderId16x9: string; renderId9x16: string; bucketName: string }
interface RenderStatus { done: boolean; outputFile: string | null; overallProgress: number; errors: unknown[] }

export function ProjectEditor({ project, userId, rendersRemaining, planTier }: ProjectEditorProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>((project.photos as unknown as PhotoItem[]) ?? [])
  const [address, setAddress] = useState(project.address ?? '')
  const [price, setPrice] = useState(project.price ?? '')
  const [beds, setBeds] = useState(project.beds ?? '')
  const [baths, setBaths] = useState(project.baths ?? '')
  const [presets, setPresets] = useState<{ id: string; name: string }[]>([])
  const [brandPresetId, setBrandPresetId] = useState(project.brandPresetId ?? '')
  const [audioTrackId, setAudioTrackId] = useState(project.audioTrackId ?? 'track_1')
  const [newPresetName, setNewPresetName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [generateMessage, setGenerateMessage] = useState('')
  const [renderProgress, setRenderProgress] = useState(0)
  const [renderFailed, setRenderFailed] = useState(false)
  const [focusPickerPhotoId, setFocusPickerPhotoId] = useState<string | null>(null)
  const [previewAspect, setPreviewAspect] = useState<'16:9' | '9:16'>('16:9')
  const [savedField, setSavedField] = useState<string | null>(null)
  const [downloadUrls, setDownloadUrls] = useState<{ url16x9: string | null; url9x16: string | null }>({
    url16x9: project.video16x9Url ?? null,
    url9x16: project.video9x16Url ?? null,
  })
  const [localRemaining, setLocalRemaining] = useState(rendersRemaining)

  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const savePhotosTimerRef = useRef<NodeJS.Timeout | null>(null)
  const photosRef = useRef(photos)
  useEffect(() => { photosRef.current = photos }, [photos])

  useEffect(() => {
    fetch(`/api/brand-presets?userId=${userId}`).then(r => r.json()).then(setPresets).catch(() => {})
  }, [userId])

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }

  // Debounced save to prevent race conditions
  const debouncedSavePhotos = useCallback((updated: PhotoItem[]) => {
    if (savePhotosTimerRef.current) clearTimeout(savePhotosTimerRef.current)
    savePhotosTimerRef.current = setTimeout(async () => {
      await fetch(`/api/projects/${project.id}/photos`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: updated }),
      })
    }, 400)
  }, [project.id])

  async function saveField(field: string, value: string) {
    await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    setSavedField(field)
    setTimeout(() => setSavedField(null), 2000)
  }

  async function resetRender() {
    setRenderFailed(false); setGenerateMessage(''); setRenderProgress(0)
    await fetch('/api/render/reset', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id }),
    })
  }

  async function pollRenderStatus(r: RenderResult) {
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      if (attempts > 72) {
        stopPolling(); setGenerateMessage('Render timed out.'); setGenerating(false); setRenderFailed(true)
        await fetch('/api/render/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: project.id }) })
        return
      }
      try {
        const [a, b] = await Promise.all([
          fetch(`/api/render/status/${r.renderId16x9}?bucketName=${r.bucketName}`),
          fetch(`/api/render/status/${r.renderId9x16}?bucketName=${r.bucketName}`),
        ])
        const s16: RenderStatus = await a.json()
        const s9: RenderStatus = await b.json()
        const hasErrors = (s16.errors?.length ?? 0) > 0 || (s9.errors?.length ?? 0) > 0
        if (hasErrors) {
          stopPolling(); setGenerating(false); setRenderFailed(true)
          setGenerateMessage('Render failed. You can retry without using another render credit.')
          await fetch('/api/render/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: project.id }) })
          return
        }
        setRenderProgress(Math.round(((s16.overallProgress ?? 0) + (s9.overallProgress ?? 0)) / 2 * 100))
        if (s16.done && s9.done) {
          stopPolling(); setGenerating(false); setRenderProgress(100); setGenerateMessage('Renders complete!'); setRenderFailed(false)
          setLocalRemaining(prev => Math.max(0, prev - 1))
          const url16x9 = s16.outputFile ?? null; const url9x16 = s9.outputFile ?? null
          setDownloadUrls({ url16x9, url9x16 })
          if (url16x9 || url9x16) {
            await fetch(`/api/projects/${project.id}`, {
              method: 'PATCH', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ video16x9Url: url16x9, video9x16Url: url9x16, status: 'COMPLETED' }),
            })
          }
        }
      } catch { /* keep polling */ }
    }, 5000)
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const total = files.length
    setUploadStatus(`Uploading ${total} photo(s) in background...`)
    ;(async () => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadStatus(`Uploading photo ${i + 1} of ${total}...`)
        try {
          const pr = await fetch('/api/upload/presign', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: file.type, projectId: project.id }),
          })
          const { uploadUrl, key } = await pr.json()
          await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
          const photoId = crypto.randomUUID()
          const xr = await fetch('/api/upload/proxy', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ highResKey: key, projectId: project.id, photoId }),
          })
          const { proxyKey } = await xr.json()
          const newPhoto: PhotoItem = { id: photoId, highResKey: key, proxyKey, focusX: 50, focusY: 50 }
          const updated = [...photosRef.current, newPhoto]
          photosRef.current = updated
          setPhotos([...updated])
          debouncedSavePhotos(updated)
        } catch { /* continue */ }
      }
      setUploadStatus(`${photosRef.current.length} photo(s) ready.`)
    })()
  }

  function movePhoto(index: number, direction: 'up' | 'down') {
    const updated = [...photos]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= updated.length) return
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setPhotos(updated); debouncedSavePhotos(updated)
  }

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index)
    setPhotos(updated); debouncedSavePhotos(updated)
  }

  function handleFocalPointClick(e: React.MouseEvent<HTMLDivElement>, photoId: string) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)))
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)))
    const updated = photos.map(p => p.id === photoId ? { ...p, focusX: x, focusY: y } : p)
    setPhotos(updated); setFocusPickerPhotoId(null); debouncedSavePhotos(updated)
  }

  async function createPreset() {
    if (!newPresetName.trim()) return
    const res = await fetch('/api/brand-presets', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name: newPresetName.trim() }),
    })
    const preset = await res.json()
    setPresets(prev => [...prev, preset]); setNewPresetName('')
  }

  async function handleGenerate() {
    setGenerating(true); setGenerateMessage('Starting renders...'); setRenderProgress(0)
    setRenderFailed(false); setDownloadUrls({ url16x9: null, url9x16: null }); stopPolling()
    const res = await fetch('/api/render', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id }),
    })
    const data = await res.json()
    if (!res.ok) { setGenerateMessage(data.error ?? 'Render failed.'); setGenerating(false); return }
    setGenerateMessage('Rendering... this takes 2-4 minutes.')
    pollRenderStatus(data)
  }

  const slug = toSlug(address || 'listing')
  const canGenerate = photos.length > 0 && !generating && localRemaining > 0
  const ss: React.CSSProperties = { backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, padding: 24, marginBottom: 16 }
  const ls: React.CSSProperties = { display: 'block', fontSize: 12, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }
  const is: React.CSSProperties = { width: '100%', padding: '8px 12px', backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: 6, color: '#F5F5F5', fontSize: 14, outline: 'none' }

  const playerWidth = previewAspect === '16:9' ? 1920 : 1080
  const playerHeight = previewAspect === '16:9' ? 1080 : 1920

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 4 }}>{address || 'Untitled Project'}</h1>
        <p style={{ color: '#888888', fontSize: 14, margin: 0 }}>Project Editor</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, alignItems: 'start' }}>
        <div>

          {/* PHOTOS */}
          <div style={ss}>
            <h2 style={{ marginBottom: 16, marginTop: 0 }}>Photos</h2>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: 6, fontSize: 13, cursor: 'pointer', marginBottom: 12 }}>
              + Add Photos
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
            {uploadStatus && <p style={{ fontSize: 13, color: '#888888', marginBottom: 12 }}>{uploadStatus}</p>}
            {photos.length === 0 ? (
              <p style={{ fontSize: 13, color: '#888888', padding: '24px 0', textAlign: 'center' }}>No photos yet. Add photos to get started.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {photos.map((photo, index) => (
                  <div key={photo.id} style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                    <img src={getS3Url(photo.proxyKey)} alt={`Photo ${index + 1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                    {focusPickerPhotoId === photo.id && (
                      <div onClick={(e) => handleFocalPointClick(e, photo.id)} style={{ position: 'absolute', inset: 0, cursor: 'crosshair', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ position: 'absolute', left: `${photo.focusX}%`, top: `${photo.focusY}%`, transform: 'translate(-50%,-50%)', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#E8D5B7', border: '2px solid white', pointerEvents: 'none' }} />
                      </div>
                    )}
                    <button type="button" onClick={() => setFocusPickerPhotoId(focusPickerPhotoId === photo.id ? null : photo.id)} style={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', color: '#E8D5B7', fontSize: 10, padding: '2px 6px', borderRadius: 3, border: 'none', cursor: 'pointer' }}>
                      {focusPickerPhotoId === photo.id ? 'Cancel' : '⊕ Focus'}
                    </button>
                    <div style={{ position: 'absolute', top: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', color: '#888888', fontSize: 11, padding: '2px 5px', borderRadius: 3 }}>{index + 1}</div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: 2, padding: 4, backgroundColor: 'rgba(0,0,0,0.6)' }}>
                      <button type="button" onClick={() => movePhoto(index, 'up')} style={{ flex: 1, padding: '3px 0', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#F5F5F5', borderRadius: 3 }}>↑</button>
                      <button type="button" onClick={() => movePhoto(index, 'down')} style={{ flex: 1, padding: '3px 0', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#F5F5F5', borderRadius: 3 }}>↓</button>
                      <button type="button" onClick={() => removePhoto(index)} style={{ flex: 1, padding: '3px 0', fontSize: 11, backgroundColor: 'rgba(239,68,68,0.3)', border: 'none', color: '#FCA5A5', borderRadius: 3 }}>✕</button>
                    </div>
                    <div style={{ padding: '2px 4px', backgroundColor: '#0A0A0A', textAlign: 'center' }}>
                      <span style={{ fontSize: 10, color: '#555' }}>Focus: {photo.focusX}% {photo.focusY}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LISTING INFO */}
          <div style={ss}>
            <h2 style={{ marginBottom: 16, marginTop: 0 }}>Listing Info</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={ls}>
                Address
                {savedField === 'address' && <span style={{ marginLeft: 8, fontSize: 11, color: '#86EFAC' }}>✓ Saved</span>}
              </label>
              <input style={is} type="text" value={address} onChange={e => setAddress(e.target.value)} onBlur={() => saveField('address', address)} placeholder="123 Main St, City, State" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={ls}>Price {savedField === 'price' && <span style={{ fontSize: 11, color: '#86EFAC' }}>✓ Saved</span>}</label>
                <input style={is} type="text" value={price} onChange={e => setPrice(e.target.value)} onBlur={() => saveField('price', price)} placeholder="850,000" />
              </div>
              <div>
                <label style={ls}>Beds {savedField === 'beds' && <span style={{ fontSize: 11, color: '#86EFAC' }}>✓ Saved</span>}</label>
                <input style={is} type="text" value={beds} onChange={e => setBeds(e.target.value)} onBlur={() => saveField('beds', beds)} placeholder="4" />
              </div>
              <div>
                <label style={ls}>Baths {savedField === 'baths' && <span style={{ fontSize: 11, color: '#86EFAC' }}>✓ Saved</span>}</label>
                <input style={is} type="text" value={baths} onChange={e => setBaths(e.target.value)} onBlur={() => saveField('baths', baths)} placeholder="2.5" />
              </div>
            </div>
          </div>

          {/* BRAND PRESET */}
          <div style={ss}>
            <h2 style={{ marginBottom: 16, marginTop: 0 }}>Brand Preset</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={ls}>Select Preset</label>
              <select style={is} value={brandPresetId} onChange={e => { setBrandPresetId(e.target.value); saveField('brandPresetId', e.target.value) }}>
                <option value="">-- Select a preset --</option>
                {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...is, flex: 1 }} type="text" placeholder="New preset name" value={newPresetName} onChange={e => setNewPresetName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createPreset()} />
              <button type="button" onClick={createPreset} style={{ padding: '8px 16px', backgroundColor: '#1A1A1A', border: '1px solid #262626', color: '#F5F5F5', borderRadius: 6, fontSize: 13, whiteSpace: 'nowrap' }}>Create</button>
            </div>
          </div>

          {/* AUDIO */}
          <div style={ss}>
            <h2 style={{ marginBottom: 4, marginTop: 0 }}>Audio Track</h2>
            <p style={{ fontSize: 13, color: '#888888', marginBottom: 16 }}>Preview and select the background music for this video.</p>
            <AudioPicker value={audioTrackId} onChange={(id) => { setAudioTrackId(id); saveField('audioTrackId', id) }} />
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ position: 'sticky', top: 72 }}>
          <div style={{ ...ss, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Preview</h2>
              {/* Aspect ratio toggle */}
              <div style={{ display: 'flex', gap: 2, backgroundColor: '#1A1A1A', borderRadius: 6, padding: 2 }}>
                {(['16:9', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setPreviewAspect(ratio)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: previewAspect === ratio ? '#262626' : 'transparent',
                      border: 'none',
                      borderRadius: 4,
                      color: previewAspect === ratio ? '#F5F5F5' : '#888888',
                      fontSize: 11,
                      fontWeight: previewAspect === ratio ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              width: '100%',
              aspectRatio: previewAspect === '16:9' ? '16/9' : '9/16',
              backgroundColor: '#000',
              borderRadius: 6,
              overflow: 'hidden',
              maxHeight: previewAspect === '9:16' ? 400 : undefined,
            }}>
              <Player
                component={ListingVideo}
                inputProps={{ photos, address }}
                durationInFrames={150}
                fps={30}
                compositionWidth={playerWidth}
                compositionHeight={playerHeight}
                style={{ width: '100%', height: '100%' }}
                controls={false}
                acknowledgeRemotionLicense
              />
            </div>
            <p style={{ fontSize: 12, color: '#888888', marginTop: 8 }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} · {previewAspect} preview
            </p>
          </div>

          <div style={ss}>
            {/* Usage counter */}
            <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: '#1A1A1A', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#888888' }}>Renders remaining</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: localRemaining === 0 ? '#FCA5A5' : localRemaining <= 3 ? '#FCD34D' : '#86EFAC' }}>
                {localRemaining} / {planTier === 'PRO' ? 50 : planTier === 'STARTER' ? 15 : 0}
              </span>
            </div>

            {localRemaining === 0 && !generating && (
              <div style={{ marginBottom: 12, padding: '10px 14px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6 }}>
                <p style={{ fontSize: 13, color: '#FCA5A5', margin: 0 }}>
                  Monthly limit reached. <a href="/pricing" style={{ color: '#E8D5B7', textDecoration: 'underline' }}>Upgrade your plan</a>
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              style={{ width: '100%', padding: '12px 24px', backgroundColor: canGenerate ? '#E8D5B7' : '#1A1A1A', color: canGenerate ? '#0A0A0A' : '#888888', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600 }}
            >
              {generating ? `Rendering... ${renderProgress}%` : 'Generate Video'}
            </button>

            {photos.length === 0 && !generating && (
              <p style={{ fontSize: 12, color: '#888888', marginTop: 8, textAlign: 'center' }}>Add photos to enable rendering</p>
            )}

            {generating && renderProgress > 0 && (
              <div style={{ marginTop: 12, backgroundColor: '#1A1A1A', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#E8D5B7', width: `${renderProgress}%`, transition: 'width 0.5s ease' }} />
              </div>
            )}

            {generateMessage && !renderFailed && (
              <p style={{ fontSize: 13, color: generateMessage.includes('complete') ? '#86EFAC' : '#888888', marginTop: 8, textAlign: 'center' }}>
                {generateMessage}
              </p>
            )}

            {renderFailed && (
              <div style={{ marginTop: 12, padding: '12px 14px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6 }}>
                <p style={{ fontSize: 13, color: '#FCA5A5', margin: '0 0 10px' }}>{generateMessage || 'Render failed.'}</p>
                <button
                  type="button"
                  onClick={async () => { await resetRender(); handleGenerate() }}
                  style={{ width: '100%', padding: '8px 16px', backgroundColor: '#1A1A1A', border: '1px solid #262626', color: '#F5F5F5', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
                >
                  ↺ Retry Render
                </button>
              </div>
            )}

            {(downloadUrls.url16x9 || downloadUrls.url9x16) && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #262626' }}>
                <p style={{ fontSize: 12, color: '#888888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Downloads</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {downloadUrls.url16x9 && (
                    <a href={downloadUrls.url16x9} download={`${slug}_16x9.mp4`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px 16px', backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: 6, fontSize: 13, color: '#E8D5B7', textAlign: 'center', textDecoration: 'none', fontWeight: 500 }}>
                      ↓ Download 16:9 (Landscape)
                    </a>
                  )}
                  {downloadUrls.url9x16 && (
                    <a href={downloadUrls.url9x16} download={`${slug}_9x16.mp4`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px 16px', backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: 6, fontSize: 13, color: '#E8D5B7', textAlign: 'center', textDecoration: 'none', fontWeight: 500 }}>
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
