
import { LayoutGrid, List, AlertCircle, Newspaper } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import Card from '../ui/Card';
import { SkeletonGrid } from '../ui/Skeleton';
import Button from '../ui/Button';

/**
 * News Grid Coordinator.
 * Handles toolbar actions (layout switching: grid vs. list), active count headers,
 * API-failure warnings, skeleton arrays, and empty search results layouts.
 */
export function NewsGrid({
  articles,
  loading,
  loadingMore,
  error,
  showBookmarksOnly,
  hasMore,
  onLoadMore,
  onOpenDetails,
  onResetFilters,
}) {
  const { layoutPreference, setLayoutPreference, category, searchQuery, isBookmarked: checkBookmarked, toggleBookmark } = useNews();
  


  // Helper to trigger layout toggle
  const toggleLayout = (pref) => {
    setLayoutPreference(pref);
  };

  // Determine grid visual classes based on layout preferences
  const gridClasses =
    layoutPreference === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      : 'flex flex-col gap-6';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow relative z-10">
      
      {/* Dynamic Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-5 mb-8 gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl font-serif font-black tracking-tight capitalize">
            {showBookmarksOnly
              ? 'Saved Reading List'
              : `${category === 'general' ? 'General' : category} Headlines`}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {loading ? (
              <span>Querying GNews index...</span>
            ) : (
              <span>
                Found {articles.length} article{articles.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            )}
          </p>
        </div>

        {/* Layout Preferences Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleLayout('grid')}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              layoutPreference === 'grid'
                ? 'bg-white/10 border-white/20 text-white shadow-sm shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'bg-transparent border-white/5 text-slate-400 hover:text-white hover:border-white/15'
            }`}
            title="Grid Layout"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleLayout('list')}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              layoutPreference === 'list'
                ? 'bg-white/10 border-white/20 text-white shadow-sm shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'bg-transparent border-white/5 text-slate-400 hover:text-white hover:border-white/15'
            }`}
            title="Editorial List Layout"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Failure Warnings */}
      {!loading && error && (
        <div className="mb-8 p-4 rounded-xl border border-red-500/20 bg-red-950/20 flex items-start gap-3 animate-fade-in backdrop-blur-md">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider block mb-0.5">
              GNews Connection Error
            </span>
            <p className="text-red-300/80 text-xs leading-normal">
              {error}. Please verify your API Key credentials in Settings.
            </p>
          </div>
        </div>
      )}

      {/* Shimmer loading state */}
      {loading && (
        <SkeletonGrid count={8} layout={layoutPreference} />
      )}

      {/* No articles state */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-16 px-4 max-w-md mx-auto animate-fade-in glass-panel rounded-2xl border border-white/5">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-white/10">
            <Newspaper className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg mb-1.5">
            No articles found
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
            We couldn't locate any stories matching your query. Try updating your search terms or choosing a different news category.
          </p>
          {onResetFilters && (
            <Button variant="primary" size="sm" onClick={onResetFilters} className="text-xs">
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* Articles Grid / List rendering */}
      {!loading && articles.length > 0 && (
        <>
          <div className={gridClasses}>
            {articles.map((article, index) => {
              const isSaved = showBookmarksOnly
                ? true // In bookmarks-only view, everything is bookmarked by definition
                : checkBookmarked(article.id);

              return (
                <Card
                  key={article.id || `article-${index}`}
                  article={article}
                  layout={layoutPreference}
                  isBookmarked={isSaved}
                  onBookmarkToggle={toggleBookmark}
                  onOpenDetails={onOpenDetails}
                />
              );
            })}
          </div>

          {/* Load More Dispatch Trigger */}
          {!showBookmarksOnly && hasMore && (
            <div className="w-full py-12 flex justify-center items-center animate-fade-in">
              <Button
                variant="primary"
                onClick={onLoadMore}
                loading={loadingMore}
                className="text-xs font-bold uppercase tracking-wider px-8 py-3.5 min-w-[220px]"
              >
                {loadingMore ? 'Retrieving Next Dispatch...' : 'Load More Headlines'}
              </Button>
            </div>
          )}

          {/* Edge of gravity signoff */}
          {!showBookmarksOnly && !hasMore && articles.length > 0 && (
            <div className="w-full py-14 text-center border-t border-white/5 mt-10">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest select-none">
                — You have reached the edge of gravity —
              </span>
            </div>
          )}
        </>
      )}
    </main>
  );
}
export default NewsGrid;
