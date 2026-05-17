import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { BookSummary } from '@/entities/book/model/types';
import { ru } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';

import { Badge } from './Badge';

type BookCardProps = {
  book: BookSummary;
  className?: string;
  onPrefetchDetails?: (workId: string) => void;
};

export function BookCard({ book, className, onPrefetchDetails }: BookCardProps) {
  const subjects = (book.subjects ?? []).slice(0, 2);
  const year = book.firstPublishYear != null ? String(book.firstPublishYear) : null;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      <Link
        to={`/books/${encodeURIComponent(book.id)}`}
        className={cn(
          'group block w-[clamp(9.5rem,32vmin,11.5rem)] max-w-[min(100%,11.5rem)] shrink-0 cursor-pointer sm:w-[11.25rem]',
          className,
        )}
        onMouseEnter={() => onPrefetchDetails?.(book.id)}
        onFocus={() => onPrefetchDetails?.(book.id)}
      >
        <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated/40 shadow-glass backdrop-blur-xl">
          <div className="aspect-[3/4] overflow-hidden bg-white/5">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt=""
                loading="lazy"
                className="relative z-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-slate-900 px-2 text-center text-sm text-slate-400">
                {ru.details.noCover}
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
            {year ? (
              <div className="pointer-events-none absolute right-2 top-2 z-[1] flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-semibold text-slate-100 backdrop-blur">
                <Calendar className="h-3.5 w-3.5 text-amber-200" aria-hidden />
                {year}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-2 space-y-1.5 px-0.5">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-50">
            {book.title}
          </p>
          {book.authors[0] ? (
            <p className="line-clamp-1 text-xs text-slate-500">{book.authors.join(', ')}</p>
          ) : null}
          {subjects.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {subjects.map((g) => (
                <Badge key={g} variant="outline" className="text-[10px]">
                  {g}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}
