import { cn } from '@/shared/lib/cn';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative animate-shimmer overflow-hidden rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  );
}

export function BookCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-[clamp(9.5rem,32vmin,11.5rem)] max-w-[min(100%,11.5rem)] shrink-0 flex-col gap-2 sm:w-[11.25rem]',
        className,
      )}
    >
      <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function BookDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-48 w-full rounded-3xl sm:h-64" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <Skeleton className="mx-auto h-72 w-52 shrink-0 rounded-3xl lg:mx-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}
