import { Composition } from 'remotion'
import { ListingVideo } from './compositions/ListingVideo'
import { PhotoItem } from '@/lib/types'

const FPS = 30
const INTRO = 3 * FPS
const PHOTO = 4 * FPS
const OUTRO = 2 * FPS

export function RemotionRoot() {
  return (
    <Composition
      id="ListingVideo"
      component={ListingVideo}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={INTRO + 10 * PHOTO + OUTRO}
      defaultProps={{
        photos: [] as PhotoItem[],
        address: '',
        price: '',
        beds: '',
        baths: '',
        audioTrackId: 'track_1',
        agentName: '',
        brokerageName: '',
        primaryColor: '#E8D5B7',
      }}
      calculateMetadata={async ({ props }) => {
        const photoCount = props.photos?.length ?? 0
        const duration = INTRO + photoCount * PHOTO + OUTRO
        return { durationInFrames: Math.max(duration, INTRO + OUTRO + FPS) }
      }}
    />
  )
}
