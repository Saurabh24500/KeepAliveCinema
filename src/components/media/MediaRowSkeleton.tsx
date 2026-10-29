import { Skeleton } from '../ui/Skeleton'

export function MediaRowSkeleton() {
  return (
    <section aria-hidden="true">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="w-40 shrink-0 sm:w-44 lg:w-48">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-4/5" />
            <Skeleton className="mt-2 h-3 w-1/3" />
          </div>
        ))}
      </div>
    </section>
  )
}
