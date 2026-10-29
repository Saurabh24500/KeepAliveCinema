import { Plus } from 'lucide-react'

export function CreatePostAction() {
  return (
    <button
      type="button"
      disabled
      title="Create post — available with the community milestone"
      aria-label="Create a post (available in a later milestone)"
      className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-cinema-accent px-5 text-sm font-semibold text-white shadow-xl shadow-cinema-accent/25 transition-colors hover:bg-cinema-accent-strong disabled:cursor-not-allowed disabled:opacity-70 sm:bottom-7 sm:right-7"
    >
      <Plus aria-hidden="true" className="size-5" />
      <span className="hidden sm:inline">Create post</span>
      <span className="sr-only">Create post (coming soon)</span>
    </button>
  )
}
