'use client'

const TRACKS = [
  { id: 'track_1', label: 'Track 1 — Warm & Inviting' },
  { id: 'track_2', label: 'Track 2 — Modern & Clean' },
  { id: 'track_3', label: 'Track 3 — Upbeat & Bright' },
]

interface AudioPickerProps {
  value: string
  onChange: (trackId: string) => void
}

export function AudioPicker({ value, onChange }: AudioPickerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {TRACKS.map(track => (
        <button
          key={track.id}
          type="button"
          onClick={() => onChange(track.id)}
          style={{
            padding: '10px 16px',
            backgroundColor: value === track.id ? '#1A1A1A' : 'transparent',
            border: `1px solid ${value === track.id ? '#E8D5B7' : '#262626'}`,
            borderRadius: 6,
            color: value === track.id ? '#E8D5B7' : '#888888',
            fontSize: 13,
            fontWeight: value === track.id ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            backgroundColor: value === track.id ? '#E8D5B7' : '#333',
          }} />
          {track.label}
        </button>
      ))}
    </div>
  )
}
