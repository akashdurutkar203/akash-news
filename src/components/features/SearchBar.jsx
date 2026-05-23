import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { useDebounce } from '../../hooks/useDebounce';

const QUICK_TAGS = [
  'Quantum Computing',
  'Supply Chains',
  'Fusion Energy',
  'mRNA Vaccine',
  'Underdog',
  'Virtual Reality',
];

/**
 * Animated Search Bar Component.
 * Integrates debouncing internally to update the global Search Query.
 * Includes quick tag filters and interactive focus animations.
 */
export function SearchBar({ showBookmarksOnly, onDisableBookmarksView }) {
  const { setSearchQuery, category } = useNews();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 400);

  // Sync debounced search value to the global NewsContext state
  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  // Reset local input if global category or view switches
  useEffect(() => {
    // If category changes or Bookmarks are activated, keep search text but clear if requested
  }, [category]);

  const handleClear = () => {
    setInputValue('');
  };

  const handleTagClick = (tag) => {
    // Disable bookmarks view if active to run the search in standard categories
    if (showBookmarksOnly && onDisableBookmarksView) {
      onDisableBookmarksView();
    }
    setInputValue(tag);
  };

  return (
    <div className="w-full bg-[#030712]/45 py-6 border-b border-white/5 backdrop-blur-md relative z-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Search Input Container */}
        <div className="relative flex items-center glass-input rounded-xl shadow-sm transition-all duration-300 px-4 h-12 focus-within:bg-white/5 focus-within:border-blue-500/50 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              showBookmarksOnly
                ? "Search bookmarked articles..."
                : `Search news in "${category.toUpperCase()}"...`
            }
            className="w-full h-full bg-transparent border-0 outline-none text-[var(--text-primary)] text-sm placeholder:text-slate-500 px-3 py-1 font-sans"
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestion tags row */}
        {!showBookmarksOnly && (
          <div className="flex flex-wrap items-center gap-2 mt-3.5 justify-center md:justify-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-1">
              Trending Topics:
            </span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="trending-tag px-3 py-1 rounded text-[11px] font-medium bg-white/5 hover:bg-blue-500/10 text-slate-400 hover:text-blue-300 border border-white/5 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default SearchBar;
