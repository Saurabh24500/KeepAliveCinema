import { useCallback, useEffect, useState } from 'react'
import { fetchMyJournal } from './journal-service'
import type { JournalEntry, WatchlistStatus } from './journal-types'

export function useMyJournal(status?: WatchlistStatus) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMyJournal(status)
      setEntries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load journal')
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    void load()
  }, [load])

  return { entries, loading, error, reload: load }
}
