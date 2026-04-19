import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
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
  secondaryColor?: string
  logoKey?: string
  headshotKey?: string
  styleMode?: 'cinematic' | 'social' | 'minimal'
  brandPresetId?: string
  [key: string]: unknown
}

const FPS = 30
const INTRO_DURATION = 3 * FPS
const PHOTO_DURATION = 4 * FPS
const TRANSITION_DURATION = 15
const OUTRO_DURATION = 2 * FPS

function getStyleSettings(styleMode: 'cinematic' | 'social' | 'minimal' = 'cinematic') {
  if (styleMode === 'social') {
    return {
      background: '#120f16',
      introBackground: 'linear-gradient(135deg, #120f16 0%, #241727 100%)',
      overlayBackground: 'rgba(18,15,22,0.54)',
      textColor: '#fff7fb',
      zoomAmount: 0.12,
      panAmount: 4.8,
      photoDuration: Math.round(3.2 * FPS),
      transitionDuration: 10,
      introDuration: Math.round(2.4 * FPS),
      outroDuration: Math.round(1.8 * FPS),
      accentBarWidth: 64,
      lowerThirdPosition: 'top' as const,
      lowerThirdFontSize: 34,
    }
  }

  if (styleMode === 'minimal') {
    return {
      background: '#0c0d0e',
      introBackground: '#0c0d0e',
      overlayBackground: 'rgba(12,13,14,0.42)',
      textColor: '#f5f5f5',
      zoomAmount: 0.04,
      panAmount: 1.5,
      photoDuration: Math.round(4.5 * FPS),
      transitionDuration: 18,
      introDuration: Math.round(2.5 * FPS),
      outroDuration: Math.round(2 * FPS),
      accentBarWidth: 36,
      lowerThirdPosition: 'bottom' as const,
      lowerThirdFontSize: 24,
    }
  }

  return {
    background: '#0A0A0A',
    introBackground: '#0A0A0A',
    overlayBackground: 'rgba(0,0,0,0.65)',
    textColor: '#F5F5F5',
    zoomAmount: 0.08,
    panAmount: 3,
    photoDuration: PHOTO_DURATION,
    transitionDuration: TRANSITION_DURATION,
    introDuration: INTRO_DURATION,
    outroDuration: OUTRO_DURATION,
    accentBarWidth: 48,
    lowerThirdPosition: 'bottom' as const,
    lowerThirdFontSize: 28,
  }
}

function IntroCard({ address, price, beds, baths, primaryColor, styleMode }: {
  address: string
  price?: string
  beds?: string
  baths?: string
  primaryColor?: string
  styleMode?: 'cinematic' | 'social' | 'minimal'
}) {
  const frame = useCurrentFrame()
  const accent = primaryColor ?? '#E8D5B7'
  const style = getStyleSettings(styleMode)

  const opacity = interpolate(frame, [0, 20, style.introDuration - 20, style.introDuration], [0, 1, 1, 0], {
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
    <AbsoluteFill style={{ background: style.introBackground, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity, transform: `translateY(${translateY}px)`, textAlign: 'center', padding: '0 80px', maxWidth: 1400 }}>
        <div style={{ width: style.accentBarWidth, height: 2, backgroundColor: accent, margin: '0 auto 32px' }} />
        <div style={{ fontSize: styleMode === 'social' ? 64 : 72, fontWeight: 700, color: style.textColor, fontFamily: 'sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24 }}>
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

function PhotoSlide({ photo, index, totalPhotos, address, primaryColor, styleMode }: {
  photo: PhotoItem
  index: number
  totalPhotos: number
  address: string
  primaryColor?: string
  styleMode?: 'cinematic' | 'social' | 'minimal'
}) {
  const frame = useCurrentFrame()
  const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? 'fastlisting-assets'
  const style = getStyleSettings(styleMode)
  const accent = primaryColor ?? '#E8D5B7'

  const panDirections = ['left', 'right', 'up', 'down', 'diagonal-in', 'diagonal-out']
  const direction = panDirections[index % panDirections.length]

  const progress = interpolate(frame, [0, style.photoDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  })

  const scale = 1 + style.zoomAmount * progress
  let translateX = 0
  let translateY = 0

  if (direction === 'left') translateX = -style.panAmount * progress
  if (direction === 'right') translateX = style.panAmount * progress
  if (direction === 'up') translateY = -style.panAmount * progress
  if (direction === 'down') translateY = style.panAmount * progress
  if (direction === 'diagonal-in') { translateX = -style.panAmount * 0.7 * progress; translateY = -style.panAmount * 0.7 * progress }
  if (direction === 'diagonal-out') { translateX = style.panAmount * 0.7 * progress; translateY = style.panAmount * 0.7 * progress }

  const isLast = index === totalPhotos - 1

  const fadeIn = interpolate(frame, [0, style.transitionDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fadeOut = isLast ? 1 : interpolate(
    frame,
    [style.photoDuration - style.transitionDuration, style.photoDuration],
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
  const ltOpacity = interpolate(frame, [20, 40, style.photoDuration - 20, style.photoDuration - 5], [0, 1, 1, 0], {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focusX}% ${focusY}%` }}
          />
        </div>
      </AbsoluteFill>

      {/* Lower third */}
      <AbsoluteFill style={{ display: 'flex', alignItems: style.lowerThirdPosition === 'top' ? 'flex-start' : 'flex-end', padding: style.lowerThirdPosition === 'top' ? '48px 36px 0' : '0 60px 48px' }}>
        <div style={{
          opacity: ltOpacity,
          transform: `translateY(${ltTranslateY}px)`,
          backgroundColor: style.overlayBackground,
          padding: styleMode === 'social' ? '10px 18px' : '12px 24px',
          borderLeft: `3px solid ${accent}`,
          borderRadius: styleMode === 'social' ? 14 : 0,
        }}>
          <div style={{ color: style.textColor, fontSize: style.lowerThirdFontSize, fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '-0.01em' }}>
            {address}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

function OutroCard({ agentName, brokerageName, primaryColor, secondaryColor, logoKey, headshotKey, styleMode }: {
  agentName?: string
  brokerageName?: string
  primaryColor?: string
  secondaryColor?: string
  logoKey?: string
  headshotKey?: string
  styleMode?: 'cinematic' | 'social' | 'minimal'
}) {
  const frame = useCurrentFrame()
  const accent = primaryColor ?? '#E8D5B7'
  const style = getStyleSettings(styleMode)
  const textColor = secondaryColor ?? '#F5F5F5'
  const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? 'fastlisting-assets'
  const assetBase = `https://${S3_BUCKET}.s3.us-east-1.amazonaws.com`
  const logoSrc = logoKey ? `${assetBase}/${logoKey}` : null
  const headshotSrc = headshotKey ? `${assetBase}/${headshotKey}` : null

  const opacity = interpolate(frame, [0, 20, style.outroDuration - 10, style.outroDuration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: style.introBackground, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity, textAlign: 'center', padding: '0 64px', maxWidth: 1100 }}>
        <div style={{ width: style.accentBarWidth, height: 2, backgroundColor: accent, margin: '0 auto 24px' }} />
        {logoSrc ? (
          <div style={{ marginBottom: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt=""
              style={{ maxWidth: 220, maxHeight: 72, objectFit: 'contain' }}
            />
          </div>
        ) : null}
        {headshotSrc ? (
          <div style={{ marginBottom: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={headshotSrc}
              alt=""
              style={{ width: 108, height: 108, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}` }}
            />
          </div>
        ) : null}
        {agentName ? (
          <div style={{ fontSize: 48, fontWeight: 600, color: textColor, fontFamily: 'sans-serif', marginBottom: 12 }}>
            {agentName}
          </div>
        ) : null}
        {brokerageName ? (
          <div style={{ fontSize: 28, color: accent, fontFamily: 'sans-serif', fontWeight: 400 }}>
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
  secondaryColor,
  logoKey,
  headshotKey,
  styleMode = 'cinematic',
}: ListingVideoProps) {
  const style = getStyleSettings(styleMode)
  const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? 'fastlisting-assets'
  const S3_BASE = `https://${S3_BUCKET}.s3.us-east-1.amazonaws.com`
  const audioSrc = `${S3_BASE}/audio/${audioTrackId}.mp3`

  const totalPhotoDuration = photos.length * style.photoDuration
  const totalDuration = style.introDuration + totalPhotoDuration + style.outroDuration

  return (
    <AbsoluteFill style={{ backgroundColor: style.background }}>

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

      <Sequence from={0} durationInFrames={style.introDuration}>
        <IntroCard address={address} price={price} beds={beds} baths={baths} primaryColor={primaryColor} styleMode={styleMode} />
      </Sequence>

      {photos.map((photo, index) => (
        <Sequence key={photo.id} from={style.introDuration + index * style.photoDuration} durationInFrames={style.photoDuration}>
          <PhotoSlide
            photo={photo}
            index={index}
            totalPhotos={photos.length}
            address={address}
            primaryColor={primaryColor}
            styleMode={styleMode}
          />
        </Sequence>
      ))}

      <Sequence from={style.introDuration + totalPhotoDuration} durationInFrames={style.outroDuration}>
        <OutroCard
          agentName={agentName}
          brokerageName={brokerageName}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          logoKey={logoKey}
          headshotKey={headshotKey}
          styleMode={styleMode}
        />
      </Sequence>

    </AbsoluteFill>
  )
}
