export interface Profile {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string | null
  favorite_genres: string[]
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface ProfileUpdateInput {
  username: string
  display_name: string
  bio: string
  favorite_genres: string[]
}

export const favoriteGenres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Thriller',
] as const

export const maximumFavoriteGenres = 6
export const maximumAvatarBytes = 2 * 1024 * 1024
export const maximumBioLength = 300

export function profileDisplayName(profile: Profile | null): string {
  if (!profile) return ''
  return profile.display_name.trim() || profile.username
}

export function calculateProfileCompletion(profile: Profile): number {
  const checks = [
    profile.username.trim().length > 0,
    profile.display_name.trim().length > 0,
    profile.bio.trim().length > 0,
    profile.favorite_genres.length > 0,
    Boolean(profile.avatar_url),
  ]

  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
