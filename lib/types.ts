export interface PhotoItem {
  id: string
  highResKey: string
  proxyKey: string
  focusX: number
  focusY: number
}

export interface RenderPayload {
  photos: PhotoItem[]
  address: string
  price: string
  beds: string
  baths: string
  brandPresetId: string
  audioTrackId: string
  aspectRatio: '16:9' | '9:16'
  agentName?: string
  brokerageName?: string
  primaryColor?: string
  secondaryColor?: string
  logoKey?: string
  headshotKey?: string
}
