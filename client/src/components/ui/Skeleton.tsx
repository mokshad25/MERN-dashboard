import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-xl',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent',
        'before:animate-shimmer',
        className
      )}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
