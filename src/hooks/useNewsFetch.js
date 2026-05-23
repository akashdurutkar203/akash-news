import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage news fetching from GNews with pagination support.
 * Returns live data, loading indicators, page status, and a loadMore callback.
 * 
 * @param {string} category The active category (e.g. 'general', 'technology').
 * @param {string} debouncedSearchQuery The debounced search string.
 * @param {string} gnewsApiKey The active GNews API key.
 * @returns {Object} { articles, loading, loadingMore, error, hasMore, loadMore }
 */
export function useNewsFetch(category, debouncedSearchQuery, gnewsApiKey) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Track previous filters for render-time resetting
  const [prevFilters, setPrevFilters] = useState({
    category,
    debouncedSearchQuery,
    gnewsApiKey,
  });

  // Reset state during render if category, search query, or API Key changes
  if (
    category !== prevFilters.category ||
    debouncedSearchQuery !== prevFilters.debouncedSearchQuery ||
    gnewsApiKey !== prevFilters.gnewsApiKey
  ) {
    setArticles([]);
    setPage(1);
    setHasMore(gnewsApiKey && gnewsApiKey.trim() !== '' ? true : false);
    setError(null);
    setPrevFilters({
      category,
      debouncedSearchQuery,
      gnewsApiKey,
    });
  }

  useEffect(() => {
    // If no key is configured, yield and wait for onboarding
    if (!gnewsApiKey || gnewsApiKey.trim() === '') {
      return;
    }

    let active = true;
    let timeoutId = null;

    const fetchGNews = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        let fetchUrl = '';
        const limit = 10; // GNews free tier limit

        if (debouncedSearchQuery && debouncedSearchQuery.trim() !== '') {
          // Search mode
          fetchUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            debouncedSearchQuery
          )}&lang=en&token=${gnewsApiKey}&page=${page}&max=${limit}`;
        } else {
          // Headlines mode
          const gnewsCategory = category === 'all' ? 'general' : category;
          fetchUrl = `https://gnews.io/api/v4/top-headlines?category=${gnewsCategory}&lang=en&token=${gnewsApiKey}&page=${page}&max=${limit}`;
        }

        const response = await fetch(fetchUrl);
        
        if (!active) return;

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.errors 
              ? errorData.errors.join(', ') 
              : (errorData.message || `HTTP request failed with status: ${response.status}`)
          );
        }

        const data = await response.json();
        
        if (!active) return;

        if (data.articles && data.articles.length > 0) {
          const unifiedArticles = data.articles.map((art, idx) => ({
            id: `gnews-${page}-${idx}-${art.publishedAt}-${encodeURIComponent(art.url).slice(-10)}`,
            title: art.title,
            description: art.description || '',
            content: art.content || art.description || '',
            url: art.url,
            image: art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
            publishedAt: art.publishedAt,
            sourceName: art.source?.name || 'GNews',
            author: art.source?.name || 'Staff Reporter',
            category: category,
          }));

          setArticles((prev) => {
            // Filter duplicates (GNews might occasionally repeat results in edge cases)
            const existingUrls = new Set(prev.map((a) => a.url));
            const newUniqueArticles = unifiedArticles.filter((a) => !existingUrls.has(a.url));
            return [...prev, ...newUniqueArticles];
          });

          // If results are less than the limit, we have reached the end
          if (data.articles.length < limit) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
        
        setLoading(false);
        setLoadingMore(false);
      } catch (err) {
        if (!active) return;
        
        console.error('GNews API Fetch failed:', err);
        setError(err.message || 'Unknown network error occurred');
        if (page === 1) {
          setArticles([]);
        }
        setLoading(false);
        setLoadingMore(false);
        setHasMore(false);
      }
    };

    // Delay the API call slightly to debounce double-mounting in StrictMode
    timeoutId = setTimeout(() => {
      fetchGNews();
    }, 100);

    return () => {
      active = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [category, debouncedSearchQuery, gnewsApiKey, page]);

  // Callback trigger to increment page count
  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, loadingMore, hasMore]);

  return { articles, loading, loadingMore, error, hasMore, loadMore };
}

export default useNewsFetch;
