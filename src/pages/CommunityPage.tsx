import { useEffect, useState } from 'react'
import { useCommunity } from '../features/community/useCommunity'
import { useAuth } from '../features/auth/auth-context'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { Users } from 'lucide-react'
import type { Post } from '../features/community/community-types'

import { usePageTitle } from '../hooks/usePageTitle'

export function CommunityPage() {
  usePageTitle('Community')
  const { user } = useAuth()
  const { post, loadPosts, toggleLike, loading, error } = useCommunity()
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [spoilers, setSpoilers] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  async function load() {
    try {
      const data = await loadPosts(20, 0)
      setPosts(data as Post[])
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handlePost() {
    if (!content.trim()) return
    await post(content.trim(), spoilers)
    setContent('')
    setSpoilers(false)
    await load()
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cinema-accent/80">Community</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">Posts</h1>
      </header>

      {user ? (
        <div className="mb-6 rounded-2xl border border-cinema-border bg-cinema-surface/40 p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={1000}
            className="w-full rounded-xl bg-cinema-bg/60 p-3 text-sm text-cinema-text"
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-cinema-muted">
              <input type="checkbox" checked={spoilers} onChange={(e) => setSpoilers(e.target.checked)} />
              Contains spoilers
            </label>
            <Button size="sm" disabled={loading || !content.trim()} onClick={handlePost}>
              Post
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-sm text-cinema-muted">Sign in to post.</div>
      )}

      {loading && posts.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load posts" description={error} onRetry={load} />
      ) : posts.length === 0 ? (
        <EmptyState icon={Users} title="No posts yet" description="Be the first to post." />
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <article key={p.id} className="rounded-2xl border border-cinema-border bg-cinema-surface/40 p-4">
              <p className="text-xs text-cinema-muted">{new Date(p.created_at).toLocaleString()}</p>
              {p.contains_spoilers && !revealed[p.id] ? (
                <div className="mt-2 rounded-xl bg-cinema-bg/60 p-3 text-sm text-cinema-muted">
                  <p>Spoiler</p>
                  <button
                    onClick={() => setRevealed((r) => ({ ...r, [p.id]: true }))}
                    className="mt-2 text-xs text-cinema-accent"
                  >
                    Reveal
                  </button>
                </div>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-sm text-cinema-text">{p.content}</p>
              )}
              {user ? (
                <button
                  onClick={async () => {
                    await toggleLike(p.id, false)
                  }}
                  className="mt-3 text-xs text-cinema-muted hover:text-cinema-accent"
                >
                  Like
                </button>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
