

/**
 * Premium Shimmer Skeleton Loader.
 * Mirrors the exact layout geometry of Card.jsx for both Grid and List modes, preventing layout shifts.
 */
export function Skeleton({ layout = 'grid' }) {
  const shimmerBase = 'animate-shimmer-dark rounded bg-slate-800/40';

  // 1. LIST LAYOUT SKELETON (Horizontal Row)
  if (layout === 'list') {
    return (
      <div className="flex flex-col md:flex-row glass-card rounded-xl overflow-hidden h-48">
        {/* Left Image Placeholder */}
        <div className={`w-full md:w-64 h-full flex-shrink-0 ${shimmerBase} rounded-r-none`} />

        {/* Right Details Placeholder */}
        <div className="flex flex-col justify-between flex-grow p-6">
          <div className="space-y-4">
            {/* Source & Clock row */}
            <div className="flex justify-between items-center">
              <div className={`w-20 h-4.5 ${shimmerBase}`} />
              <div className={`w-16 h-3.5 ${shimmerBase}`} />
            </div>
            
            {/* Title - Two lines */}
            <div className="space-y-2">
              <div className={`w-[85%] h-5.5 ${shimmerBase}`} />
              <div className={`w-[60%] h-5.5 ${shimmerBase}`} />
            </div>

            {/* Description - Two lines */}
            <div className="space-y-1.5 pt-1">
              <div className={`w-[95%] h-3.5 ${shimmerBase}`} />
              <div className={`w-[90%] h-3.5 ${shimmerBase}`} />
            </div>
          </div>

          {/* Footer - Author & Arrow */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className={`w-24 h-4.5 ${shimmerBase}`} />
            <div className={`w-8 h-8 rounded-full ${shimmerBase}`} />
          </div>
        </div>
      </div>
    );
  }

  // 2. GRID LAYOUT SKELETON (Vertical Card)
  return (
    <div className="flex flex-col glass-card rounded-xl overflow-hidden h-full">
      {/* Top Image Placeholder */}
      <div className={`w-full h-48 sm:h-52 ${shimmerBase} rounded-b-none flex-shrink-0`} />

      {/* Content Placeholders */}
      <div className="flex flex-col justify-between flex-grow p-5 space-y-4">
        <div className="space-y-3.5 flex-grow">
          {/* Source & Date line */}
          <div className="flex justify-between items-center">
            <div className={`w-16 h-4 ${shimmerBase}`} />
            <div className={`w-12 h-3.5 ${shimmerBase}`} />
          </div>

          {/* Title - Two lines */}
          <div className="space-y-1.5">
            <div className={`w-[90%] h-5 ${shimmerBase}`} />
            <div className={`w-[70%] h-5 ${shimmerBase}`} />
          </div>

          {/* Description - Three lines */}
          <div className="space-y-1.5 pt-2">
            <div className={`w-[95%] h-3.5 ${shimmerBase}`} />
            <div className={`w-[90%] h-3.5 ${shimmerBase}`} />
            <div className={`w-[80%] h-3.5 ${shimmerBase}`} />
          </div>
        </div>

        {/* Footer line */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className={`w-20 h-4 ${shimmerBase}`} />
          <div className={`w-12 h-3 ${shimmerBase}`} />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid layout of Skeleton loaders.
 * Useful to render dynamic skeleton arrays based on column preferences.
 */
export function SkeletonGrid({ count = 8, layout = 'grid' }) {
  const gridClasses =
    layout === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      : 'flex flex-col gap-6';

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={`shimmer-card-${index}`} layout={layout} />
      ))}
    </div>
  );
}

export default Skeleton;
