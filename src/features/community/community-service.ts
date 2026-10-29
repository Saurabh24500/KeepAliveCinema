import { supabase } from '../../lib/supabase'

export async function createPost(content: string, containsSpoilers = false, mediaId: string | null = null) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')
  const { data: userData } = await client.auth.getUser()
  const user_id = userData.user?.id
  if (!user_id) throw new Error('Not authenticated')

  const { data, error } = await client
    .from('posts')
    .insert({ user_id, content, contains_spoilers: containsSpoilers, media_id: mediaId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchPosts(limit = 20, offset = 0) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')
  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data ?? []
}

export async function likePost(postId: string) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')
  const { data: userData } = await client.auth.getUser()
  const user_id = userData.user?.id
  if (!user_id) throw new Error('Not authenticated')
  const { error } = await client.from('likes').insert({ post_id: postId, user_id })
  if (error) throw error
}

export async function unlikePost(postId: string) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')
  const { data: userData } = await client.auth.getUser()
  const user_id = userData.user?.id
  if (!user_id) throw new Error('Not authenticated')
  const { error } = await client.from('likes').delete().eq('post_id', postId).eq('user_id', user_id)
  if (error) throw error
}

export async function fetchComments(postId: string) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')
  const { data, error } = await client
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function addComment(postId: string, content: string) {
  const client = supabase
  if (!client) throw new Error('Supabase not configured')
  const { data: userData } = await client.auth.getUser()
  const user_id = userData.user?.id
  if (!user_id) throw new Error('Not authenticated')
  const { data, error } = await client.from('comments').insert({ post_id: postId, user_id, content }).select().single()
  if (error) throw error
  return data
}
