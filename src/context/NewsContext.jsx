/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const NewsContext = createContext();

/**
 * Global News Context Provider.
 * Coordinates GNews navigation, layout types, active key authentication, and bookmarks.
 */
export function NewsProvider({ children }) {
  // 1. Navigation & Search State
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Responsive Layout Preference ('grid' or 'list')
  const [layoutPreference, setLayoutPreference] = useState(() => {
    try {
      const saved = localStorage.getItem('news_app_layout');
      return saved ? saved : 'grid';
    } catch {
      return 'grid';
    }
  });

  // 3. Exclusive GNews API Key (prioritizes Vite environmental config, fallback to localStorage)
  const [gnewsApiKey, setGnewsApiKey] = useState(() => {
    try {
      // First, check environment variable from .env
      const envKey = import.meta.env.VITE_GNEWS_API_KEY;
      if (envKey && envKey.trim() !== '') return envKey.trim();

      // Fallback: check local storage for custom key
      const savedKey = localStorage.getItem('news_app_gnews_api_key');
      if (savedKey) return savedKey;
      
      return '';
    } catch {
      return '';
    }
  });

  // 4. Reading List (Bookmarks)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('news_app_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Theme Preference ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('news_app_theme');
      return saved ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Toggle Theme Callback
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync theme with document class list
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
      localStorage.setItem('news_app_theme', theme);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  }, [theme]);

  // Persist layout preferences
  useEffect(() => {
    try {
      localStorage.setItem('news_app_layout', layoutPreference);
    } catch (e) {
      console.warn('Failed to save layout preference:', e);
    }
  }, [layoutPreference]);

  // Persist custom API Key to local storage
  useEffect(() => {
    try {
      if (gnewsApiKey) {
        localStorage.setItem('news_app_gnews_api_key', gnewsApiKey);
      } else {
        localStorage.removeItem('news_app_gnews_api_key');
      }
    } catch (e) {
      console.warn('Failed to save GNews API key:', e);
    }
  }, [gnewsApiKey]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('news_app_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  // Toggle Bookmark
  const toggleBookmark = (article) => {
    setBookmarks((prev) => {
      const exists = prev.some((item) => item.id === article.id);
      if (exists) {
        return prev.filter((item) => item.id !== article.id);
      } else {
        return [...prev, { ...article, bookmarkedAt: new Date().toISOString() }];
      }
    });
  };

  // Check Bookmark status
  const isBookmarked = (articleId) => {
    return bookmarks.some((item) => item.id === articleId);
  };

  return (
    <NewsContext.Provider
      value={{
        category,
        setCategory,
        searchQuery,
        setSearchQuery,
        layoutPreference,
        setLayoutPreference,
        gnewsApiKey,
        setGnewsApiKey,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
