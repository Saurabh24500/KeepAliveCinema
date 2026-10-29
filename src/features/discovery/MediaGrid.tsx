import { Skeleton } from '../../components/ui/Skeleton'
import { MediaPosterCard } from './MediaPosterCard'
import type { DiscoveryMedia } from './tmdb-types'

export function MediaGrid({ items }: { items: DiscoveryMedia[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((media) => (
        <MediaPosterCard key={media.key} media={media} />
      ))}
    </div>
  )
}

export function MediaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-4/5" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
