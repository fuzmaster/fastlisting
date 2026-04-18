'use client'

import { useRef, useState } from 'react'

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? ''
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION ?? 'us-east-1'

const TRACKS = [
  { id: 'track_1', label: 'Track 1', description: 'Warm & Inviting' },
  { id: 'track_2', label: 'Track 2', description: 'Modern & Clean' },
  { id: 'track_3', label: 'Track 3', description: 'Upbeat & Bright' },
]

interface AudioPickerProps {
  value: string
  onChange: (trackId: string) => void
}

export function AudioPicker({ value, onChange }: AudioPickerProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function getTrackUrl(trackId: string) {
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/audio/${trackId}.mp3`
  }

  function togglePreview(trackId: string) {
    if (playingId === trackId) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const audio = new Audio(getTrackUrl(trackId))
    audio.volume = 0.6
    audio.play().catch(() => {})
    audio.onended = () => setPlayingId(null)
    audioRef.current = audio
    setPlayingId(trackId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {TRACKS.map(track => {
        const isSelected = value === track.id
        const isPlaying = playingId === track.id
        return (
          <div
            key={track.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              backgroundColor: isSelected ? '#1A1A1A' : 'transparent',
              border: `1px solid ${isSelected ? '#E8D5B7' : '#262626'}`,
              borderRadius: 6,
              cursor: 'pointer',
            }}
            onClick={() => onChange(track.id)}
          >
            {/* Selected indicator */}
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              backgroundColor: isSelected ? '#E8D5B7' : '#333',
            }} />

            {/* Track info */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#E8D5B7' : '#888888' }}>
                {track.label}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#555' }}>{track.description}</p>
            </div>

            {/* Preview button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); togglePreview(track.id) }}
              style={{
                padding: '4px 10px',
                backgroundColor: isPlaying ? 'rgba(232,213,183,0.15)' : '#1A1A1A',
                border: `1px solid ${isPlaying ? '#E8D5B7' : '#262626'}`,
                borderRadius: 4,
                color: isPlaying ? '#E8D5B7' : '#888888',
                fontSize: 11,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {isPlaying ? '■ Stop' : '▶ Preview'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
