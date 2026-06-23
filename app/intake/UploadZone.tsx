'use client'

import { useCallback, useRef, useState } from 'react'

import styles from './page.module.css'

export type UploadedFile = {
  key: string
  filename: string
  size: number
  contentType: string
}

type FileItem = {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  error?: string
  uploaded?: UploadedFile
}

type Props = {
  draftId: string
  onChange: (files: UploadedFile[]) => void
}

const ACCEPT =
  'image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm'

const MAX_BYTES = 500 * 1024 * 1024
const MAX_CONCURRENT = 3

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function uploadToS3(
  file: File,
  draftId: string,
  onProgress: (pct: number) => void
): Promise<UploadedFile> {
  const presignRes = await fetch('/api/intake/upload/presign', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      draftId,
    }),
  })

  if (!presignRes.ok) {
    const body = await presignRes.json().catch(() => ({}))
    throw new Error(body?.error || 'Could not prepare upload')
  }

  const { uploadUrl, key } = (await presignRes.json()) as { uploadUrl: string; key: string }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('content-type', file.type)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(file)
  })

  return { key, filename: file.name, size: file.size, contentType: file.type }
}

export function UploadZone({ draftId, onChange }: Props) {
  const [items, setItems] = useState<FileItem[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const emit = useCallback(
    (next: FileItem[]) => {
      const uploaded = next.filter((i) => i.uploaded).map((i) => i.uploaded as UploadedFile)
      onChange(uploaded)
    },
    [onChange]
  )

  const processQueue = useCallback(
    async (newItems: FileItem[]) => {
      let active = 0
      let cursor = 0
      const queue = [...newItems]

      return new Promise<void>((resolve) => {
        const next = () => {
          if (cursor >= queue.length && active === 0) {
            resolve()
            return
          }
          while (active < MAX_CONCURRENT && cursor < queue.length) {
            const item = queue[cursor++]
            active++
            setItems((prev) =>
              prev.map((p) => (p.id === item.id ? { ...p, status: 'uploading', progress: 0 } : p))
            )

            uploadToS3(item.file, draftId, (pct) => {
              setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, progress: pct } : p)))
            })
              .then((uploaded) => {
                setItems((prev) => {
                  const updated = prev.map((p) =>
                    p.id === item.id ? { ...p, status: 'done' as const, progress: 100, uploaded } : p
                  )
                  emit(updated)
                  return updated
                })
              })
              .catch((err: Error) => {
                setItems((prev) =>
                  prev.map((p) =>
                    p.id === item.id ? { ...p, status: 'error' as const, error: err.message } : p
                  )
                )
              })
              .finally(() => {
                active--
                next()
              })
          }
        }
        next()
      })
    },
    [draftId, emit]
  )

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const accepted: FileItem[] = []
      const rejected: string[] = []

      Array.from(files).forEach((file) => {
        if (file.size > MAX_BYTES) {
          rejected.push(`${file.name} (too large)`)
          return
        }
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${file.name}`,
          file,
          status: 'pending',
          progress: 0,
        })
      })

      if (accepted.length === 0) {
        if (rejected.length) alert(`Skipped: ${rejected.join(', ')}`)
        return
      }

      setItems((prev) => [...prev, ...accepted])
      void processQueue(accepted)
    },
    [processQueue]
  )

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id)
      emit(next)
      return next
    })
  }

  const doneCount = items.filter((i) => i.status === 'done').length
  const uploadingCount = items.filter((i) => i.status === 'uploading' || i.status === 'pending').length

  return (
    <div>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <div className={styles.dropzoneInner}>
          <strong>Drop photos or videos here</strong>
          <span className={styles.dropzoneHint}>
            or click to browse · JPG, PNG, HEIC, MP4, MOV · up to 500MB each
          </span>
        </div>
      </div>

      {items.length > 0 && (
        <div className={styles.uploadList}>
          <div className={styles.uploadSummary}>
            <span>
              {doneCount} of {items.length} uploaded
              {uploadingCount > 0 && ` · ${uploadingCount} in progress`}
            </span>
          </div>
          {items.map((item) => (
            <div key={item.id} className={styles.uploadItem}>
              <div className={styles.uploadItemMain}>
                <span className={styles.uploadName}>{item.file.name}</span>
                <span className={styles.uploadMeta}>{formatSize(item.file.size)}</span>
              </div>
              <div className={styles.uploadStatusWrap}>
                {item.status === 'uploading' && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${item.progress}%` }} />
                  </div>
                )}
                {item.status === 'done' && <span className={styles.uploadOk}>✓</span>}
                {item.status === 'error' && (
                  <span className={styles.uploadErr} title={item.error}>
                    failed
                  </span>
                )}
                <button
                  type="button"
                  className={styles.uploadRemove}
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
