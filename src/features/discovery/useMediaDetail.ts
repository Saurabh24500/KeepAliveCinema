import { useCallback, useEffect, useState } from 'react'
import {
  fetchMediaDetail,
  isAbortError,
  isTmdbConfigured,
  readableTmdbError,
} from './tmdb'
import type { MediaDetail, TmdbKind } from './tmdb-types'

interface DetailResult {
  key: string
  media: MediaDetail | null
  error: string | null
}

export function useMediaDetail(kind: TmdbKind | null, id: number | null) {
  const [result, setResult] = useState<DetailResult | null>(null)
  const [retryToken, setRetryToken] = useState(0)
  const requestKey =
    kind && id && isTmdbConfigured ? `${kind}:${id}:${retryToken}` : null

  useEffect(() => {
    if (!kind || !id || !isTmdbConfigured) return

    const controller = new AbortController()
    const key = `${kind}:${id}:${retryToken}`

    fetchMediaDetail(kind, id, controller.signal)
      .then((media) => {
        if (controller.signal.aborted) return
        setResult({ key, media, error: null })
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || controller.signal.aborted) return
        setResult({
          key,
          media: null,
          error: readableTmdbError(error),
        })
      })

    return () => {
      controller.abort()
    }
  }, [kind, id, retryToken])

  const retry = useCallback(() => {
    setRetryToken((token) => token + 1)
  }, [])

  const current = requestKey && result?.key === requestKey ? result : null

  return {
    media: current?.media ?? null,
    loading: Boolean(requestKey && !current),
    error: current?.error ?? null,
    retry,
  }
}
