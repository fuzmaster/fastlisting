import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { PhotoItem } from '@/lib/types'

export interface ListingVideoProps {
  photos: PhotoItem[]
  address: string
  price?: string
  beds?: string
  baths?: string
  audioTrackId?: string
  aspectRatio?: '16:9' | '9:16'
  agentName?: string
  brokerageName?: string
  primaryColor?: string
  logoKey?: string
  headshotKey?: string
  brandPresetId?: string
  [key: string]: unknown
}

const FPS = 30
const INTRO_DURATION = 3 * FPS
const PHOTO_DURATION = 4 * FPS
const TRANSITION_DURATION = 15
const OUTRO_DURATION = 2 * FPS

function IntroCard({ address, price, beds, baths, primaryColor }: {
  address: string
  price?: string
  beds?: string
  baths?: string
  primaryColor?: string
}) {
  const frame = useCurrentFrame()
  const accent = primaryColor ?? '#E8D5B7'

  const opacity = interpolate(frame, [0, 20, INTRO_DURATION - 20, INTRO_DURATION], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const translateY = interpolate(frame, [0, 20], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  })

  const meta = [
    price ? `$${price}` : null,
    beds ? `${beds} bd` : null,
    baths ? `${baths} ba` : null,
  ].filter(Boolean).join('  ·  ')

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity, transform: `translateY(${translateY}px)`, textAlign: 'center', padding: '0 80px', maxWidth: 1400 }}>
        <div style={{ width: 48, height: 2, backgroundColor: accent, margin: '0 auto 32px' }} />
        <div style={{ fontSize: 72, fontWeight: 700, color: '#F5F5F5', fontFamily: 'sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24 }}>
          {address || 'Property Address'}
        </div>
        {meta ? (
          <div style={{ fontSize: 32, color: accent, fontFamily: 'sans-serif', fontWeight: 400, letterSpacing: '0.05em' }}>
            {meta}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  )
}

function PhotoSlide({ photo, index, totalPhotos, address }: {
  photo: PhotoItem
  index: number
  totalPhotos: number
  address: string
}) {
  const frame = useCurrentFrame()
  const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? 'fastlisting-assets'

  const panDirections = ['left', 'right', 'up', 'down', 'diagonal-in', 'diagonal-out']
  const direction = panDirections[index % panDirections.length]

  const progress = interpolate(frame, [0, PHOTO_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  })

  const zoomAmount = 0.08
  const panAmount = 3
  const scale = 1 + zoomAmount * progress
  let translateX = 0
  let translateY = 0

  if (direction === 'left') translateX = -panAmount * progress
  if (direction === 'right') translateX = panAmount * progress
  if (direction === 'up') translateY = -panAmount * progress
  if (direction === 'down') translateY = panAmount * progress
  if (direction === 'diagonal-in') { translateX = -panAmount * 0.7 * progress; translateY = -panAmount * 0.7 * progress }
  if (direction === 'diagonal-out') { translateX = panAmount * 0.7 * progress; translateY = panAmount * 0.7 * progress }

  const isLast = index === totalPhotos - 1

  const fadeIn = interpolate(frame, [0, TRANSITION_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fadeOut = isLast ? 1 : interpolate(
    frame,
    [PHOTO_DURATION - TRANSITION_DURATION, PHOTO_DURATION],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const opacity = Math.min(fadeIn, fadeOut)

  const focusX = photo.focusX ?? 50
  const focusY = photo.focusY ?? 50

  const imgSrc = photo.highResKey.startsWith('http')
    ? photo.highResKey
    : `https://${S3_BUCKET}.s3.us-east-1.amazonaws.com/${photo.highResKey}`

  // Lower third
  const ltOpacity = interpolate(frame, [20, 40, PHOTO_DURATION - 20, PHOTO_DURATION - 5], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const ltTranslateY = interpolate(frame, [20, 40], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  })

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Photo with Ken Burns */}
      <AbsoluteFill>
        <div style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: `${focusX}% ${focusY}%`,
          willChange: 'transform',
        }}>
          <img
            src={imgSrc}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focusX}% ${focusY}%` }}
          />
        </div>
      </AbsoluteFill>

      {/* Lower third */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'flex-end', padding: '0 60px 48px' }}>
        <div style={{
          opacity: ltOpacity,
          transform: `translateY(${ltTranslateY}px)`,
          backgroundColor: 'rgba(0,0,0,0.65)',
          padding: '12px 24px',
          borderLeft: '3px solid #E8D5B7',
        }}>
          <div style={{ color: '#F5F5F5', fontSize: 28, fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '-0.01em' }}>
            {address}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

function OutroCard({ agentName, brokerageName, primaryColor }: {
  agentName?: string
  brokerageName?: string
  primaryColor?: string
}) {
  const frame = useCurrentFrame()
  const accent = primaryColor ?? '#E8D5B7'

  const opacity = interpolate(frame, [0, 20, OUTRO_DURATION - 10, OUTRO_DURATION], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity, textAlign: 'center' }}>
        <div style={{ width: 48, height: 2, backgroundColor: accent, margin: '0 auto 24px' }} />
        {agentName ? (
          <div style={{ fontSize: 48, fontWeight: 600, color: '#F5F5F5', fontFamily: 'sans-serif', marginBottom: 12 }}>
            {agentName}
          </div>
        ) : null}
        {brokerageName ? (
          <div style={{ fontSize: 28, color: '#888888', fontFamily: 'sans-serif', fontWeight: 400 }}>
            {brokerageName}
          </div>
        ) : null}
        {!agentName && !brokerageName ? (
          <div style={{ fontSize: 36, color: '#888888', fontFamily: 'sans-serif' }}>
            Contact us today
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  )
}

export function ListingVideo({
  photos = [],
  address = '',
  price,
  beds,
  baths,
  audioTrackId = 'track_1',
  agentName,
  brokerageName,
  primaryColor,
}: ListingVideoProps) {
  const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? 'fastlisting-assets'
  const S3_BASE = `https://${S3_BUCKET}.s3.us-east-1.amazonaws.com`
  const audioSrc = `${S3_BASE}/audio/${audioTrackId}.mp3`

  const totalPhotoDuration = photos.length * PHOTO_DURATION
  const totalDuration = INTRO_DURATION + totalPhotoDuration + OUTRO_DURATION

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>

      <Audio
        src={audioSrc}
        startFrom={0}
        volume={(frame) => {
          const fadeOutStart = totalDuration - FPS * 2
          if (frame < fadeOutStart) return 0.7
          return interpolate(frame, [fadeOutStart, totalDuration], [0.7, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }}
      />

      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroCard address={address} price={price} beds={beds} baths={baths} primaryColor={primaryColor} />
      </Sequence>

      {photos.map((photo, index) => (
        <Sequence key={photo.id} from={INTRO_DURATION + index * PHOTO_DURATION} durationInFrames={PHOTO_DURATION}>
          <PhotoSlide
            photo={photo}
            index={index}
            totalPhotos={photos.length}
            address={address}
          />
        </Sequence>
      ))}

      <Sequence from={INTRO_DURATION + totalPhotoDuration} durationInFrames={OUTRO_DURATION}>
        <OutroCard agentName={agentName} brokerageName={brokerageName} primaryColor={primaryColor} />
      </Sequence>

    </AbsoluteFill>
  )
}
