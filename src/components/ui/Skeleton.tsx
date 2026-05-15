import { cn } from './cn'

interface SkeletonProps {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('shimmer rounded-lg', className)} />
)

export const SkeletonCard = () => (
  <div className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-9 h-9 rounded-lg" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-8 w-20" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-3/4" />
  </div>
)

export const SkeletonTable = ({ rows = 10 }: { rows?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center p-4 rounded-lg border border-[#2a3040]">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20 flex-1" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
    ))}
  </div>
)

export const SkeletonMetricCards = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
)
