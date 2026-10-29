import type { MediaType } from '../../types/media'
import type {
  DiscoverCategory,
  DiscoveryMedia,
  DiscoveryPage,
  MediaDetail,
  TmdbKind,
  TmdbRawDetail,
  TmdbRawMedia,
  TmdbRawPage,
} from './tmdb-types'

const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY?.trim()
const tmdbApiBase = 'https://api.themoviedb.org/3'
const tmdbImageBase = 'https://image.tmdb.org/t/p'
const useProxy = false
const proxyBase = ''

export const isTmdbConfigured = Boolean(tmdbApiKey)
export const tmdbWebsite = 'https://www.themoviedb.org'

export type TmdbErrorKind =
  | 'unconfigured'
  | 'unauthorized'
  | 'rate-limit'
  | 'not-found'
  | 'network'
  | 'server'
  | 'unknown'

export class TmdbError extends Error {
  kind: TmdbErrorKind

  constructor(message: string, kind: TmdbErrorKind) {
    super(message)
    this.name = 'TmdbError'
    this.kind = kind
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export function readableTmdbError(error: unknown): string {
  if (error instanceof TmdbError) return error.message
  return 'TMDB could not load this section. Check your connection and try again.'
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {
  if (!tmdbApiKey) {
    throw new TmdbError(
      'TMDB is not configured. Add VITE_TMDB_API_KEY to .env.local and restart the dev server.',
      'unconfigured',
    )
  }

  const url = new URL(`${tmdbApiBase}${path}`)
  url.searchParams.set('api_key', tmdbApiKey)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const requestUrl = useProxy && proxyBase ? `${proxyBase}${url.toString()}` : url.toString()

  let response: Response

  try {
    response = await fetch(requestUrl, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new TmdbError(
      'Could not reach TMDB. Check your connection and try again.',
      'network',
    )
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new TmdbError(
        'TMDB rejected the API key. Check VITE_TMDB_API_KEY in .env.local.',
        'unauthorized',
      )
    }
    if (response.status === 404) {
      throw new TmdbError('That title could not be found on TMDB.', 'not-found')
    }
    if (response.status === 429) {
      throw new TmdbError(
        'TMDB is rate-limiting requests right now. Wait a moment and try again.',
        'rate-limit',
      )
    }
    if (response.status >= 500) {
      throw new TmdbError(
        'TMDB is having trouble right now. Try again shortly.',
        'server',
      )
    }

    throw new TmdbError(
      `TMDB request failed with status ${response.status}.`,
      'unknown',
    )
  }

  return (await response.json()) as T
}

const movieGenres: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

const tvGenres: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
}

export function genreNames(ids: number[], kind: TmdbKind): string[] {
  const genreMap = kind === 'movie' ? movieGenres : tvGenres
  return ids
    .map((id) => genreMap[id])
    .filter((name): name is string => Boolean(name))
}

function classifyMedia(
  kind: TmdbKind,
  originalLanguage: string,
  genreIds: number[],
): MediaType {
  if (originalLanguage === 'ja' && genreIds.includes(16)) return 'anime'
  return kind === 'movie' ? 'movie' : 'series'
}

function mapRawMedia(
  raw: TmdbRawMedia,
  kind: TmdbKind,
  forcedType?: MediaType,
): DiscoveryMedia {
  const date = raw.release_date ?? raw.first_air_date ?? ''
  const year = date ? Number(date.slice(0, 4)) : null
  const genreIds = raw.genre_ids ?? []
  const title =
    kind === 'movie'
      ? (raw.title ?? raw.original_title ?? 'Untitled')
      : (raw.name ?? raw.original_name ?? 'Untitled')
  const originalTitle =
    kind === 'movie'
      ? (raw.original_title ?? title)
      : (raw.original_name ?? title)
  const originalLanguage = raw.original_language ?? ''

  return {
    key: `${kind}:${raw.id}`,
    id: raw.id,
    kind,
    type:
      forcedType ?? classifyMedia(kind, originalLanguage, genreIds),
    title,
    originalTitle,
    originalLanguage,
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    date,
    year: Number.isFinite(year) ? year : null,
    genreIds,
    rating: Number(raw.vote_average ?? 0),
    voteCount: Number(raw.vote_count ?? 0),
  }
}

export async function fetchDiscoverPage(
  category: DiscoverCategory,
  page: number,
  signal?: AbortSignal,
): Promise<DiscoveryPage> {
  const kind: TmdbKind = category === 'movies' ? 'movie' : 'tv'
  const params: Record<string, string | number | undefined> = {
    page,
    sort_by: 'popularity.desc',
    include_adult: 'false',
    language: 'en-US',
  }

  if (category === 'anime') {
    params.with_genres = '16'
    params.with_original_language = 'ja'
  }
  if (category === 'series') {
    params.without_genres = '16'
  }

  const data = await tmdbFetch<TmdbRawPage<TmdbRawMedia>>(
    `/discover/${kind}`,
    params,
    signal,
  )
  const forcedType: MediaType =
    category === 'movies'
      ? 'movie'
      : category === 'anime'
        ? 'anime'
        : 'series'

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    items: data.results.map((raw) => mapRawMedia(raw, kind, forcedType)),
  }
}

export async function fetchSearchPage(
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<DiscoveryPage> {
  const data = await tmdbFetch<TmdbRawPage<TmdbRawMedia>>(
    '/search/multi',
    {
      query,
      page,
      include_adult: 'false',
      language: 'en-US',
    },
    signal,
  )

  const items = data.results
    .filter(
      (
        raw,
      ): raw is TmdbRawMedia & {
        media_type: TmdbKind
      } => raw.media_type === 'movie' || raw.media_type === 'tv',
    )
    .map((raw) => mapRawMedia(raw, raw.media_type))

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    items,
  }
}

export async function fetchMediaDetail(
  kind: TmdbKind,
  id: number,
  signal?: AbortSignal,
): Promise<MediaDetail> {
  const data = await tmdbFetch<TmdbRawDetail>(
    `/${kind}/${id}`,
    { language: 'en-US' },
    signal,
  )
  const genres = data.genres ?? []
  const genreIds = genres.length
    ? genres.map((genre) => genre.id)
    : (data.genre_ids ?? [])
  const base = mapRawMedia({ ...data, genre_ids: genreIds }, kind)

  return {
    ...base,
    genres,
    runtimeMinutes:
      data.runtime ?? (data.episode_run_time?.[0] || null),
    seasonCount: data.number_of_seasons ?? null,
    episodeCount: data.number_of_episodes ?? null,
    status: data.status ?? 'Unknown',
    tagline: data.tagline?.trim() ?? '',
    homepage: data.homepage || null,
    spokenLanguages: (data.spoken_languages ?? [])
      .map((language) => language.english_name || language.name)
      .filter((name): name is string => Boolean(name)),
  }
}

export type TmdbImageSize =
  | 'w185'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280'
  | 'original'

export function tmdbImageUrl(
  path: string | null | undefined,
  size: TmdbImageSize = 'w500',
): string | null {
  const cleanPath = path?.trim()
  if (!cleanPath) return null
  const normalized = cleanPath.startsWith('/')
    ? cleanPath
    : `/${cleanPath}`
  return `${tmdbImageBase}/${size}${normalized}`
}

export function tmdbImageSrcSet(path: string | null | undefined): string | undefined {
  const cleanPath = path?.trim()
  if (!cleanPath) return undefined

  return (['w342', 'w500', 'w780'] as const)
    .map((size) => `${tmdbImageUrl(cleanPath, size)} ${size.slice(1)}w`)
    .join(', ')
}
