import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchDiscoverPage,
  fetchSearchPage,
  isAbortError,
  isTmdbConfigured,
  readableTmdbError,
} from './tmdb'
import type {
  DiscoverCategory,
  DiscoveryMedia,
} from './tmdb-types'

interface FeedResult {
  key: string
  items: DiscoveryMedia[]
  page: number
  totalPages: number
  totalResults: number
  error: string | null
}

interface MoreError {
  key: string
  message: string
}

export function useDiscoverFeed(
  category: DiscoverCategory,
  query: string,
) {
  const trimmedQuery = query.trim()
  const [feed, setFeed] = useState<FeedResult | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [moreError, setMoreError] = useState<MoreError | null>(null)
  const [retryToken, setRetryToken] = useState(0)
  const requestIdRef = useRef(0)

  const requestKey = isTmdbConfigured
    ? `${category}:${trimmedQuery}:${retryToken}`
    : null
  const currentFeed =
    requestKey && feed?.key === requestKey ? feed : null
  const loading = Boolean(requestKey && !currentFeed)

  useEffect(() => {
    if (!isTmdbConfigured) return

    const controller = new AbortController()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    const key = `${category}:${trimmedQuery}:${retryToken}`

    const request = trimmedQuery
      ? fetchSearchPage(trimmedQuery, 1, controller.signal)
      : fetchDiscoverPage(category, 1, controller.signal)

    request
      .then((result) => {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return
        }

        setFeed({
          key,
          items: result.items,
          page: result.page,
          totalPages: result.totalPages,
          totalResults: result.totalResults,
          error: null,
        })
        setLoadingMore(false)
        setMoreError(null)
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || requestId !== requestIdRef.current) {
          return
        }

        setFeed({
          key,
          items: [],
          page: 0,
          totalPages: 0,
          totalResults: 0,
          error: readableTmdbError(error),
        })
        setLoadingMore(false)
        setMoreError(null)
      })

    return () => {
      controller.abort()
    }
  }, [category, trimmedQuery, retryToken])

  const loadMore = useCallback(async () => {
    if (
      !isTmdbConfigured ||
      !requestKey ||
      !currentFeed ||
      loading ||
      loadingMore ||
      currentFeed.error ||
      currentFeed.page >= currentFeed.totalPages
    ) {
      return
    }

    const nextPage = currentFeed.page + 1
    const requestId = requestIdRef.current
    const key = requestKey
    setLoadingMore(true)
    setMoreError(null)

    try {
      const result = trimmedQuery
        ? await fetchSearchPage(trimmedQuery, nextPage)
        : await fetchDiscoverPage(category, nextPage)

      if (requestId !== requestIdRef.current) return

      setFeed((current) => {
        if (!current || current.key !== key) return current

        const existingKeys = new Set(current.items.map((item) => item.key))
        const newItems = result.items.filter(
          (item) => !existingKeys.has(item.key),
        )

        return {
          ...current,
          items: [...current.items, ...newItems],
          page: result.page,
          totalPages: result.totalPages,
          totalResults: result.totalResults,
          error: null,
        }
      })
    } catch (error) {
      if (requestId !== requestIdRef.current) return

      setMoreError({ key, message: readableTmdbError(error) })
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingMore(false)
      }
    }
  }, [
    category,
    trimmedQuery,
    requestKey,
    currentFeed,
    loading,
    loadingMore,
  ])

  const retry = useCallback(() => {
    setRetryToken((token) => token + 1)
  }, [])

  return {
    items: currentFeed?.items ?? [],
    page: currentFeed?.page ?? 0,
    totalPages: currentFeed?.totalPages ?? 0,
    totalResults: currentFeed?.totalResults ?? 0,
    loading,
    loadingMore: loadingMore && Boolean(currentFeed),
    error: currentFeed?.error ?? null,
    moreError:
      moreError && moreError.key === requestKey
        ? moreError.message
        : null,
    hasMore: Boolean(
      currentFeed && currentFeed.page < currentFeed.totalPages,
    ),
    loadMore,
    retry,
  }
}
