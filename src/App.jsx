import { useState, useEffect } from 'react';
import { useNews } from './context/NewsContext';
import { useNewsFetch } from './hooks/useNewsFetch';
import Header from './components/features/Header';
import CategoryNavbar from './components/features/CategoryNavbar';
import SearchBar from './components/features/SearchBar';
import NewsGrid from './components/features/NewsGrid';
import ArticleDetailModal from './components/features/ArticleDetailModal';
import Button from './components/ui/Button';

function MainLayout() {
  const {
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    gnewsApiKey,
    setGnewsApiKey,
    bookmarks,
  } = useNews();

  // Fetch articles based on active category, debounced search query, and GNews API key
  const { articles, loading, loadingMore, error, hasMore, loadMore } = useNewsFetch(
    category,
    searchQuery,
    gnewsApiKey
  );

  // Modal display states
  const [activeArticle, setActiveArticle] = useState(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Onboarding local state
  const [onboardingKey, setOnboardingKey] = useState('');
  const [onboardingShowKey, setOnboardingShowKey] = useState(false);

  // Show onboarding only if we do not have a local API key AND the backend returns an API key missing error
  const isApiKeyMissing = !gnewsApiKey && error && (
    error.includes('Missing API Key') || 
    error.includes('No GNews API Key') || 
    error.includes('API key')
  );

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    if (onboardingKey.trim()) {
      setGnewsApiKey(onboardingKey.trim());
    }
  };

  // Handle Bookmarks-Only layout filter logic
  const getDisplayArticles = () => {
    if (!showBookmarksOnly) return articles;

    // Filter bookmarks locally by active search query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return bookmarks.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
      );
    }
    return bookmarks;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('general');
    setShowBookmarksOnly(false);
  };

  // Scroll to top instantly when category, search query, or bookmarks view switches
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, searchQuery, showBookmarksOnly]);

  return (
    <div className="relative flex flex-col min-h-screen bg-[var(--bg-app)] text-[var(--text-secondary)] selection:bg-blue-500/30 selection:text-white">
      {/* Ambient Backdrop Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-[pulse_8s_infinite_ease-in-out]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[130px] animate-[pulse_10s_infinite_ease-in-out_1s]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[100px] animate-[pulse_12s_infinite_ease-in-out_2s]" />
      </div>
      
      {/* 1. Brand Banner Header */}
      <Header
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarksView={() => setShowBookmarksOnly(!showBookmarksOnly)}
      />

      {/* Conditional setup overlay or full interface render */}
      {isApiKeyMissing ? (
        <div className="flex-grow flex items-center justify-center py-16 px-4 relative z-10">
          <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] animate-fade-in text-center space-y-6">
            <div className="inline-flex p-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-white font-serif font-black text-3xl tracking-tight uppercase">
                THE DAILY GRAVITY
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto font-sans">
                To stream independent live headlines and explore global affairs, please authenticate with your GNews credentials.
              </p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    GNews API Access Key
                  </label>
                  <button
                     type="button"
                     onClick={() => setOnboardingShowKey(!onboardingShowKey)}
                     className="text-[10px] text-blue-400 font-bold uppercase hover:underline cursor-pointer"
                  >
                    {onboardingShowKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative flex items-center glass-input rounded-xl px-3.5 focus-within:bg-white/5 focus-within:border-blue-500/50 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <input
                    type={onboardingShowKey ? 'text' : 'password'}
                    value={onboardingKey}
                    onChange={(e) => setOnboardingKey(e.target.value)}
                    placeholder="Paste your 32-character key here"
                    required
                    className="w-full py-3 bg-transparent border-0 outline-none text-[var(--text-primary)] text-sm placeholder:text-slate-700 font-sans"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-full py-3 justify-center text-xs font-bold uppercase tracking-wider"
              >
                Initialize News Stream
              </Button>
            </form>

            <div className="p-4 rounded-xl border border-blue-900/30 bg-blue-950/20 text-[11px] text-blue-300 leading-normal flex items-start gap-2.5 text-left">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span>Don't have a key? Registration is completely free and takes 10 seconds:</span>
                <a
                  href="https://gnews.io/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-bold inline-flex items-center gap-0.5 ml-1"
                >
                  Register on gnews.io
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Sticky Category Navigation (Hide if in bookmark mode for clean layout) */}
          <CategoryNavbar
            showBookmarksOnly={showBookmarksOnly}
            onDisableBookmarksView={() => setShowBookmarksOnly(false)}
          />

          {/* 3. Debounced Search bar */}
          <SearchBar
            showBookmarksOnly={showBookmarksOnly}
            onDisableBookmarksView={() => setShowBookmarksOnly(false)}
          />

          {/* 4. Main Articles Grid Pane */}
          <NewsGrid
            articles={getDisplayArticles()}
            loading={loading && !showBookmarksOnly} // Bookmarks resolve instantly, no shimmer needed
            loadingMore={loadingMore && !showBookmarksOnly}
            error={error && !isApiKeyMissing ? error : null} // Hide API key errors from grid if we handle them
            showBookmarksOnly={showBookmarksOnly}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onOpenDetails={(article) => setActiveArticle(article)}
            onResetFilters={handleResetFilters}
          />
        </>
      )}

      {/* 5. Editorial Footer */}
      <footer className="relative z-10 w-full bg-[#0b0f19]/80 text-slate-400 py-8 border-t border-white/5 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2.5">
          <div className="font-serif font-black text-white text-lg tracking-wider">
            THE DAILY GRAVITY
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} The Daily Gravity Press. Developed by Akash. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals & Overlays Layer */}

      {activeArticle && (
        <ArticleDetailModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </div>
  );
}

export function App() {
  // Main App wraps layout in contexts and settings
  return <MainLayout />;
}

export default App;
