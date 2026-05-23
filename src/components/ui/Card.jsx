import { Bookmark, Clock, ArrowUpRight } from 'lucide-react';

/**
 * Editorial Date Formatter.
 * Displays relative times for articles under 24 hours, and standard date strings for older articles.
 */
function formatNewsDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    
    // Fallback if system dates are mismatched or in the future
    if (diffMs < 0) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) {
      return `${diffMins <= 0 ? 1 : diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    return '';
  }
}

/**
 * Premium Article Card.
 * Supports 'grid' (standard vertical structure) and 'list' (horizontal row format).
 */
export function Card({
  article,
  layout = 'grid', // 'grid' | 'list'
  isBookmarked = false,
  onBookmarkToggle,
  onOpenDetails,
}) {
  const { title, description, image, publishedAt, sourceName, author, category } = article;

  const handleBookmarkClick = (e) => {
    e.stopPropagation(); // Avoid opening the article detail modal when clicking bookmark
    if (onBookmarkToggle) onBookmarkToggle(article);
  };

  const handleCardClick = () => {
    if (onOpenDetails) onOpenDetails(article);
  };

  // 1. LIST LAYOUT RENDER (Horizontal Editorial Row)
  if (layout === 'list') {
    return (
      <article
        onClick={handleCardClick}
        className="group gloss-shine-trigger relative flex flex-col md:flex-row glass-card rounded-xl overflow-hidden cursor-pointer"
      >
        {/* Shine Overlay */}
        <div className="gloss-shine" />

        {/* Left pane: Image Container */}
        <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0 bg-slate-900">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Floating Category tag */}
          <span className="absolute top-3 left-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
            {category || 'News'}
          </span>
        </div>

        {/* Right pane: Text Description details */}
        <div className="flex flex-col justify-between flex-grow p-5 md:p-6 relative z-10">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                {sourceName}
              </span>
              <div className="flex items-center text-slate-400 text-xs gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatNewsDate(publishedAt)}</span>
              </div>
            </div>

            <h3 className="font-serif font-bold text-lg md:text-xl group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-snug mb-2">
              {title}
            </h3>

            <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed mb-4">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
            <span className="text-slate-400 text-xs truncate max-w-[200px]">
              By <span className="text-slate-200 font-medium">{author || 'Reporter'}</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBookmarkClick}
                className={`p-2 rounded-full backdrop-blur-sm border transition-all cursor-pointer ${
                  isBookmarked 
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' 
                    : 'text-slate-400 hover:text-slate-200 bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <div className="text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. GRID LAYOUT RENDER (Vertical Card Columns)
  return (
    <article
      onClick={handleCardClick}
      className="group gloss-shine-trigger relative flex flex-col glass-card rounded-xl overflow-hidden cursor-pointer h-full"
    >
      {/* Shine Overlay */}
      <div className="gloss-shine" />

      {/* Top Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900 flex-shrink-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Floating Category tag */}
        <span className="absolute top-3 left-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
          {category || 'News'}
        </span>
        {/* Floating Bookmark Toggle */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border transition-all shadow-sm cursor-pointer ${
            isBookmarked
              ? 'bg-blue-600/80 text-white border-blue-500/55 hover:bg-blue-600'
              : 'bg-slate-950/60 hover:bg-slate-950 border-white/10 text-slate-300 hover:text-blue-400'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
        >
          <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-col justify-between flex-grow p-5 relative z-10">
        <div className="flex-grow">
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <span className="text-blue-400 text-[11px] font-bold uppercase tracking-wider truncate max-w-[60%]">
              {sourceName}
            </span>
            <div className="flex items-center text-slate-400 text-[11px] gap-1.5 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{formatNewsDate(publishedAt)}</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-base sm:text-lg group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-snug mb-2">
            {title}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <span className="text-slate-400 text-[11px] truncate max-w-[70%]">
            By <span className="text-slate-200 font-medium">{author || 'Reporter'}</span>
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Read <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
export default Card;
