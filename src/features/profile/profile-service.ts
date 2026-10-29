import { supabase } from '../../lib/supabase'
import {
  maximumAvatarBytes,
  type Profile,
  type ProfileUpdateInput,
} from './profile-types'

interface ServiceError {
  code?: string
  message: string
}

interface ProfileResult {
  profile: Profile | null
  error: string | null
}

interface ActionResult {
  error: string | null
}

interface AvatarResult {
  url: string | null
  error: string | null
}

const notConfigured =
  'Supabase is not configured. Add your project values to .env.local and restart the dev server.'

function readableProfileError(error: ServiceError): string {
  const message = error.message.toLowerCase()
  if (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    message.includes('could not find the table') ||
    message.includes('relation "public.profiles" does not exist')
  ) {
    return 'The profiles table does not exist yet. Run the profiles migration in your Supabase project.'
  }
  if (error.code === '23505') {
    return 'That username is already taken.'
  }
  if (message.includes('bucket not found')) {
    return 'The avatars storage bucket does not exist yet. Run the profiles migration in your Supabase project.'
  }
  if (
    error.code === '42501' ||
    error.message.toLowerCase().includes('row-level security')
  ) {
    return 'You do not have permission to change this profile.'
  }

  return error.message
}

export async function fetchProfile(userId: string): Promise<ProfileResult> {
  if (!supabase) return { profile: null, error: notConfigured }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    return { profile: null, error: readableProfileError(error) }
  }

  return { profile: (data as Profile | null) ?? null, error: null }
}

function profileNameFromEmail(email: string | null): {
  username: string
  displayName: string
} {
  const localPart = (email ?? '').split('@')[0] ?? ''
  const cleaned = localPart.toLowerCase().replace(/[^a-z0-9]/g, '')
  const username = cleaned.length >= 3 ? cleaned.slice(0, 18) : 'cinephile'
  const displayName = (localPart.trim() || 'Cinephile').slice(0, 60)

  return { username, displayName }
}

export async function createProfile(
  userId: string,
  email: string | null,
): Promise<ProfileResult> {
  if (!supabase) return { profile: null, error: notConfigured }

  const { username: baseUsername, displayName } = profileNameFromEmail(email)

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const suffix = attempt === 1 ? '' : String(attempt)
    const username =
      baseUsername.slice(0, 24 - suffix.length) + suffix || 'cinephile'

    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: userId, username, display_name: displayName })
      .select('*')
      .maybeSingle()

    if (!error) {
      if (!data) {
        return {
          profile: null,
          error:
            'The profile row was not created. Check the profiles insert policy in Supabase.',
        }
      }

      return { profile: data as Profile, error: null }
    }

    if (error.code === '23505') {
      const existing = await fetchProfile(userId)
      if (existing.profile) return existing
      continue
    }

    return { profile: null, error: readableProfileError(error) }
  }

  return {
    profile: null,
    error: 'Could not find an available username. Try signing in again.',
  }
}

export async function isUsernameAvailable(
  username: string,
  userId: string,
): Promise<{ available: boolean; error: string | null }> {
  if (!supabase) return { available: false, error: notConfigured }

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', userId)
    .maybeSingle()

  if (error) {
    return { available: false, error: readableProfileError(error) }
  }

  return { available: !data, error: null }
}

export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput,
): Promise<ProfileResult> {
  if (!supabase) return { profile: null, error: notConfigured }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: input.username,
      display_name: input.display_name,
      bio: input.bio,
      favorite_genres: input.favorite_genres,
    })
    .eq('id', userId)
    .select('*')
    .maybeSingle()

  if (error) {
    return { profile: null, error: readableProfileError(error) }
  }

  if (!data) {
    return {
      profile: null,
      error:
        'No profile row was found for this account. Run the profiles migration in Supabase and try again.',
    }
  }

  return { profile: data as Profile, error: null }
}

export async function updateProfileAvatar(
  userId: string,
  avatarUrl: string | null,
): Promise<ProfileResult> {
  if (!supabase) return { profile: null, error: notConfigured }

  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)
    .select('*')
    .maybeSingle()

  if (error) {
    return { profile: null, error: readableProfileError(error) }
  }

  if (!data) {
    return {
      profile: null,
      error:
        'No profile row was found for this account. Run the profiles migration in Supabase and try again.',
    }
  }

  return { profile: data as Profile, error: null }
}

export async function uploadProfileAvatar(
  userId: string,
  file: File,
): Promise<AvatarResult> {
  if (!supabase) return { url: null, error: notConfigured }

  if (!file.type.startsWith('image/')) {
    return { url: null, error: 'Choose an image file (JPG, PNG, WebP, or GIF).' }
  }
  if (file.size > maximumAvatarBytes) {
    return { url: null, error: 'Choose an image smaller than 2 MB.' }
  }

  const path = `${userId}/avatar`
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) {
    return { url: null, error: readableProfileError(error) }
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)

  return { url: `${data.publicUrl}?v=${Date.now()}`, error: null }
}

export async function removeProfileAvatar(
  userId: string,
): Promise<ActionResult> {
  if (!supabase) return { error: notConfigured }

  const { error } = await supabase.storage
    .from('avatars')
    .remove([`${userId}/avatar`])

  if (error) {
    return { error: readableProfileError(error) }
  }

  return { error: null }
}

export async function setOnboardingCompleted(
  userId: string,
  completed: boolean,
): Promise<ActionResult> {
  if (!supabase) return { error: notConfigured }

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_completed: completed })
    .eq('id', userId)

  if (error) {
    return { error: readableProfileError(error) }
  }

  return { error: null }
}
