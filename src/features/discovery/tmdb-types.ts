import type { MediaType } from '../../types/media'

export type TmdbKind = 'movie' | 'tv'
export type DiscoverCategory = 'movies' | 'anime' | 'series'

export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbRawMedia {
  id: number
  media_type?: TmdbKind | 'person'
  title?: string
  name?: string
  original_title?: string
  original_name?: string
  original_language?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
  vote_average?: number
  vote_count?: number
}

export interface TmdbRawPage<T> {
  page: number
  total_pages: number
  total_results: number
  results: T[]
}

export interface TmdbRawDetail extends TmdbRawMedia {
  genres?: TmdbGenre[]
  runtime?: number | null
  episode_run_time?: number[]
  number_of_seasons?: number
  number_of_episodes?: number
  status?: string
  tagline?: string
  homepage?: string | null
  spoken_languages?: { english_name?: string; name?: string }[]
}

export interface DiscoveryMedia {
  key: string
  id: number
  kind: TmdbKind
  type: MediaType
  title: string
  originalTitle: string
  originalLanguage: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  date: string
  year: number | null
  genreIds: number[]
  rating: number
  voteCount: number
}

export interface DiscoveryPage {
  page: number
  totalPages: number
  totalResults: number
  items: DiscoveryMedia[]
}

export interface MediaDetail extends DiscoveryMedia {
  genres: TmdbGenre[]
  runtimeMinutes: number | null
  seasonCount: number | null
  episodeCount: number | null
  status: string
  tagline: string
  homepage: string | null
  spokenLanguages: string[]
}
