import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

import { ru } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';

import { Button } from './Button';

type CarouselRowProps = {
  children: React.ReactNode;
  className?: string;
};

export function CarouselRow({ children, className }: CarouselRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.85) * dir;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className={cn('group relative w-full min-w-0 max-w-full', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[hsl(var(--surface))] to-transparent opacity-0 transition group-hover:opacity-100 sm:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[hsl(var(--surface))] to-transparent opacity-0 transition group-hover:opacity-100 sm:w-14" />

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={cn(
          'pointer-events-none absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 shadow-glass transition',
          'invisible opacity-0 md:flex',
          'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100',
        )}
        onClick={() => scrollBy(-1)}
        aria-label={ru.carousel.scrollLeft}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={cn(
          'pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 shadow-glass transition',
          'invisible opacity-0 md:flex',
          'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100',
        )}
        onClick={() => scrollBy(1)}
        aria-label={ru.carousel.scrollRight}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div
        ref={scrollerRef}
        className="no-scrollbar relative z-[2] flex w-full min-w-0 max-w-full touch-pan-x flex-nowrap gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 pt-1 [-webkit-overflow-scrolling:touch] sm:gap-4"
      >
        {children}
      </div>
    </div>
  );
}
