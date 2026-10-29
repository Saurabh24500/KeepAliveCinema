export interface Post {
  id: string
  user_id: string
  media_id: string | null
  content: string
  contains_spoilers: boolean
  created_at: string
  updated_at: string
}
