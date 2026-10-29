import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth/auth-context'
import {
  ProfileContext,
  type ProfileContextValue,
} from './profile-context'
import {
  createProfile as createProfileRow,
  fetchProfile,
  removeProfileAvatar,
  setOnboardingCompleted,
  updateProfile,
  updateProfileAvatar,
  uploadProfileAvatar,
} from './profile-service'
import type {
  Profile,
  ProfileUpdateInput,
} from './profile-types'

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, configured } = useAuth()
  const userId = user?.id ?? null

  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const [storedProfile, setStoredProfile] = useState<Profile | null>(null)
  const [storedError, setStoredError] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    if (!userId || !configured) return

    let active = true

    fetchProfile(userId).then(({ profile, error }) => {
      if (!active) return
      setStoredProfile(profile)
      setStoredError(error)
      setLoadedUserId(userId)
    })

    return () => {
      active = false
    }
  }, [userId, configured, requestVersion])

  const loading = Boolean(userId && configured && loadedUserId !== userId)
  const profile = loadedUserId === userId ? storedProfile : null
  const error = loadedUserId === userId ? storedError : null

  const refresh = useCallback(async () => {
    setLoadedUserId(null)
    setRequestVersion((version) => version + 1)
  }, [])

  const createProfile = useCallback(async () => {
    if (!userId) return { error: 'Sign in before creating your profile.' }

    const result = await createProfileRow(userId, user?.email ?? null)

    if (result.error || !result.profile) {
      return { error: result.error ?? 'Could not create your profile.' }
    }

    setStoredProfile(result.profile)
    setStoredError(null)
    setLoadedUserId(userId)

    return { error: null }
  }, [userId, user?.email])

  const saveProfile = useCallback(
    async (input: ProfileUpdateInput) => {
      if (!userId) return { error: 'Sign in before editing your profile.' }

      const result = await updateProfile(userId, input)

      if (result.error) return { error: result.error }

      setStoredProfile(result.profile)
      setStoredError(null)
      setLoadedUserId(userId)

      return { error: null }
    },
    [userId],
  )

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!userId) return { error: 'Sign in before changing your avatar.' }

      const upload = await uploadProfileAvatar(userId, file)

      if (upload.error || !upload.url) {
        return { error: upload.error ?? 'Could not upload that image.' }
      }

      const update = await updateProfileAvatar(userId, upload.url)

      if (update.error) return { error: update.error }

      setStoredProfile(update.profile)
      setStoredError(null)
      setLoadedUserId(userId)

      return { error: null }
    },
    [userId],
  )

  const removeAvatar = useCallback(async () => {
    if (!userId) return { error: 'Sign in before changing your avatar.' }

    const removal = await removeProfileAvatar(userId)

    if (removal.error) return removal

    const update = await updateProfileAvatar(userId, null)

    if (update.error) return { error: update.error }

    setStoredProfile(update.profile)
    setStoredError(null)
    setLoadedUserId(userId)

    return { error: null }
  }, [userId])

  const completeOnboarding = useCallback(async () => {
    if (!userId) return { error: 'Sign in before completing onboarding.' }

    const result = await setOnboardingCompleted(userId, true)

    if (result.error) return result

    setStoredProfile((current) =>
      current ? { ...current, onboarding_completed: true } : current,
    )

    return { error: null }
  }, [userId])

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      loading,
      error,
      configured,
      createProfile,
      saveProfile,
      uploadAvatar,
      removeAvatar,
      completeOnboarding,
      refresh,
    }),
    [
      profile,
      loading,
      error,
      configured,
      createProfile,
      saveProfile,
      uploadAvatar,
      removeAvatar,
      completeOnboarding,
      refresh,
    ],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}
