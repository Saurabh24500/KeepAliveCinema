import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useId, useRef } from 'react'
import type { MediaRowData } from '../../features/discovery/sampleMedia'
import { MediaCard } from './MediaCard'

interface MediaRowProps {
  row: MediaRowData
  sample?: boolean
}

export function MediaRow({ row, sample = false }: MediaRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const headingId = useId()

  function scroll(direction: -1 | 1) {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.8,
      behavior: 'smooth',
    })
  }

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id={headingId}
              className="font-display text-xl font-semibold tracking-tight text-cinema-text sm:text-2xl"
            >
              {row.title}
            </h2>
            {sample ? (
              <span className="rounded-full border border-cinema-accent/30 bg-cinema-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cinema-accent">
                Sample data
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-cinema-muted">{row.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${row.title} left`}
            className="flex size-9 items-center justify-center rounded-full border border-cinema-border bg-cinema-surface text-cinema-muted transition-colors hover:border-cinema-accent/60 hover:text-cinema-text"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${row.title} right`}
            className="flex size-9 items-center justify-center rounded-full border border-cinema-border bg-cinema-surface text-cinema-muted transition-colors hover:border-cinema-accent/60 hover:text-cinema-text"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {row.items.map((media) => (
          <div key={media.id} className="snap-start">
            <MediaCard media={media} />
          </div>
        ))}
      </div>
    </section>
  )
}
