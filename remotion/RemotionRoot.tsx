import { Composition } from 'remotion'
import { ListingVideo } from './compositions/ListingVideo'
import { PhotoItem } from '@/lib/types'

const FPS = 30
const INTRO = 3 * FPS
const PHOTO = 4 * FPS
const OUTRO = 2 * FPS

export function RemotionRoot() {
  const baseProps = {
    photos: [] as PhotoItem[],
    address: '',
    price: '',
    beds: '',
    baths: '',
    audioTrackId: 'track_1',
    agentName: '',
    brokerageName: '',
    primaryColor: '#E8D5B7',
  }

  const calculateMetadata = async ({ props }: { props: { photos?: PhotoItem[] } }) => {
    const photoCount = props.photos?.length ?? 0
    const duration = INTRO + photoCount * PHOTO + OUTRO
    return { durationInFrames: Math.max(duration, INTRO + OUTRO + FPS) }
  }

  return (
    <>
      <Composition
        id="ListingVideo16x9"
        component={ListingVideo}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={INTRO + 10 * PHOTO + OUTRO}
        defaultProps={{ ...baseProps, aspectRatio: '16:9' as const }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="ListingVideo9x16"
        component={ListingVideo}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={INTRO + 10 * PHOTO + OUTRO}
        defaultProps={{ ...baseProps, aspectRatio: '9:16' as const }}
        calculateMetadata={calculateMetadata}
      />
    </>
  )
}
