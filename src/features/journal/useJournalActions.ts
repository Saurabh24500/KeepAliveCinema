import { useState } from 'react'
import { deleteJournalEntry, upsertJournalEntry, upsertMediaItem } from './journal-service'
import type { WatchlistStatus } from './journal-types'

export function useJournalActions() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addToJournal(params: {
    tmdb_id: number
    media_type: string
    title: string
    poster_path?: string | null
    backdrop_path?: string | null
    release_date?: string | null
    overview?: string | null
    original_language?: string | null
    status: WatchlistStatus
    rating?: number | null
    progress?: number
    is_favorite?: boolean
    personal_note?: string | null
  }) {
    setSaving(true)
    setError(null)
    try {
      const media = await upsertMediaItem({
        tmdb_id: params.tmdb_id,
        media_type: params.media_type,
        title: params.title,
        poster_path: params.poster_path,
        backdrop_path: params.backdrop_path,
        release_date: params.release_date,
        overview: params.overview,
        original_language: params.original_language,
      })
      const entry = await upsertJournalEntry({
        media_id: media.id,
        status: params.status,
        rating: params.rating ?? null,
        progress: params.progress ?? 0,
        is_favorite: params.is_favorite ?? false,
        personal_note: params.personal_note ?? null,
      })
      return entry
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function removeFromJournal(id: string) {
    setSaving(true)
    setError(null)
    try {
      await deleteJournalEntry(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove')
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function updateEntry(params: Parameters<typeof upsertJournalEntry>[0]) {
    setSaving(true)
    setError(null)
    try {
      return await upsertJournalEntry(params)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
      throw err
    } finally {
      setSaving(false)
    }
  }

  return { addToJournal, removeFromJournal, updateEntry, saving, error }
}
