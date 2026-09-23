export default function Skeleton({ className = '', variant = 'line' }) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  const variants = {
    line: 'h-4 w-full',
    title: 'h-6 w-2/3',
    circle: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full rounded-xl'
  };
  return <div className={`${base} ${variants[variant]} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3">
      <Skeleton variant="circle" />
      <Skeleton variant="title" />
      <Skeleton />
      <Skeleton className="w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="w-1/4 h-6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800"
        >
          <Skeleton variant="circle" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/3" />
            <Skeleton className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}