export type WatchlistStatus = 'plan_to_watch' | 'watching' | 'completed' | 'paused' | 'dropped'

export interface JournalEntry {
  id: string
  user_id: string
  media_id: string
  status: WatchlistStatus
  rating: number | null
  progress: number
  is_favorite: boolean
  personal_note: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  media?: {
    id: string
    tmdb_id: number
    media_type: string
    title: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string | null
    overview: string | null
  }
}
