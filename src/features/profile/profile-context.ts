import { createContext, useContext } from 'react'
import type { Profile, ProfileUpdateInput } from './profile-types'

export interface ProfileActionResult {
  error: string | null
}

export interface ProfileContextValue {
  profile: Profile | null
  loading: boolean
  error: string | null
  configured: boolean
  createProfile: () => Promise<ProfileActionResult>
  saveProfile: (input: ProfileUpdateInput) => Promise<ProfileActionResult>
  uploadAvatar: (file: File) => Promise<ProfileActionResult>
  removeAvatar: () => Promise<ProfileActionResult>
  completeOnboarding: () => Promise<ProfileActionResult>
  refresh: () => Promise<void>
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
)

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used inside a ProfileProvider')
  }

  return context
}
