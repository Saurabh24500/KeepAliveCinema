import { supabase } from '../../lib/supabase'
import type { JournalEntry, WatchlistStatus } from './journal-types'

export async function upsertMediaItem(params: {
  tmdb_id: number
  media_type: string
  title: string
  overview?: string | null
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string | null
  original_language?: string | null
}) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')

  const { data, error } = await client
    .from('media_items')
    .upsert(
      {
        tmdb_id: params.tmdb_id,
        media_type: params.media_type,
        title: params.title,
        overview: params.overview ?? null,
        poster_path: params.poster_path ?? null,
        backdrop_path: params.backdrop_path ?? null,
        release_date: params.release_date ?? null,
        original_language: params.original_language ?? null,
      },
      { onConflict: 'tmdb_id,media_type' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function upsertJournalEntry(params: {
  media_id: string
  status: WatchlistStatus
  rating?: number | null
  progress?: number
  is_favorite?: boolean
  personal_note?: string | null
  started_at?: string | null
  completed_at?: string | null
}) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')

  const { data: userData } = await client.auth.getUser()
  const user_id = userData.user?.id
  if (!user_id) throw new Error('Not authenticated')

  const { data, error } = await client
    .from('watchlist_items')
    .upsert(
      {
        user_id,
        media_id: params.media_id,
        status: params.status,
        rating: params.rating ?? null,
        progress: params.progress ?? 0,
        is_favorite: params.is_favorite ?? false,
        personal_note: params.personal_note ?? null,
        started_at: params.started_at ?? null,
        completed_at: params.completed_at ?? null,
      },
      { onConflict: 'user_id,media_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchMyJournal(status?: WatchlistStatus): Promise<JournalEntry[]> {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')

  let query = client
    .from('watchlist_items')
    .select(
      `
      *,
      media:media_items(*)
    `,
    )
    .order('updated_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as JournalEntry[]
}

export async function deleteJournalEntry(id: string) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')

  const { error } = await client.from('watchlist_items').delete().eq('id', id)
  if (error) throw error
}
