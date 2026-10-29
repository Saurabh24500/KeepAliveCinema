import type { MediaType } from '../../types/media'

export const mediaTypeLabels: Record<MediaType, string> = {
  movie: 'Movie',
  anime: 'Anime',
  series: 'Series',
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : '—'
}

export function formatRuntime(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}
