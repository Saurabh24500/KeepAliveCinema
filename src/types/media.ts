export type MediaType = 'movie' | 'anime' | 'series'

export type PosterTone =
  | 'violet'
  | 'rose'
  | 'cyan'
  | 'amber'
  | 'emerald'
  | 'slate'

export interface MediaSummary {
  id: string
  title: string
  year: number
  type: MediaType
  genre: string
  tone: PosterTone
}
