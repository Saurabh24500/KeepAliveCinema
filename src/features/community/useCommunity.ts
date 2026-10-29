import { useState } from 'react'
import { addComment, createPost, fetchComments, fetchPosts, likePost, unlikePost } from './community-service'

export function useCommunity() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function post(content: string, spoilers = false, mediaId: string | null = null) {
    setLoading(true)
    setError(null)
    try {
      return await createPost(content, spoilers, mediaId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function loadPosts(limit = 20, offset = 0) {
    setLoading(true)
    setError(null)
    try {
      return await fetchPosts(limit, offset)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function toggleLike(postId: string, liked: boolean) {
    if (liked) await unlikePost(postId)
    else await likePost(postId)
  }

  async function loadComments(postId: string) {
    return await fetchComments(postId)
  }

  async function comment(postId: string, content: string) {
    return await addComment(postId, content)
  }

  return { post, loadPosts, toggleLike, loadComments, comment, loading, error }
}
