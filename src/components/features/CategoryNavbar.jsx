import { useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'general', label: 'Home Feed' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health & Mind' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
];

/**
 * Category Navigation Bar.
 * Sleek, horizontal scrolling bar with responsive category pills.
 * Clicking a category updates the global news state.
 */
export function CategoryNavbar({ showBookmarksOnly, onDisableBookmarksView }) {
  const { category, setCategory } = useNews();
  const scrollRef = useRef(null);

  // Handle category pill click
  const handleCategoryClick = (catId) => {
    // If user is currently looking at bookmarks, disable the bookmarks view
    if (showBookmarksOnly && onDisableBookmarksView) {
      onDisableBookmarksView();
    }
    setCategory(catId);
  };

  // Scroll navigation helper functions
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full sticky top-0 z-30 backdrop-blur-md bg-slate-950/45 border-b border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center h-14">
        
        {/* Left scroll button (visible if scrollable) */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-2 z-10 p-1.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-400 hover:text-blue-400 backdrop-blur-md transition-all focus:outline-none cursor-pointer hidden md:flex items-center justify-center hover:scale-105"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Horizontal Track */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth w-full py-2 px-1 md:px-8"
        >
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id && !showBookmarksOnly;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.25)] scale-102'
                    : 'text-slate-400 border-transparent hover:text-blue-400 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right scroll button (visible if scrollable) */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-2 z-10 p-1.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-400 hover:text-blue-400 backdrop-blur-md transition-all focus:outline-none cursor-pointer hidden md:flex items-center justify-center hover:scale-105"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Fade gradients to indicate scrolling on desktop */}
        <div className="absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-app)] to-transparent pointer-events-none hidden md:block" />
        <div className="absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-app)] to-transparent pointer-events-none hidden md:block" />
      </div>
    </div>
  );
}
export default CategoryNavbar;
