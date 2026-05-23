import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Globe, Sun, Moon } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import Button from '../ui/Button';

/**
 * Editorial Header Component.
 * Implements real-time clock, dynamic greeting, stock indices ticker, and controls for bookmarks and API settings.
 */
export function Header({ showBookmarksOnly, onToggleBookmarksView }) {
  const { bookmarks, gnewsApiKey, theme, toggleTheme } = useNews();
  const [time, setTime] = useState(new Date());

  // Real-time ticking clock (updates every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Formatter for current date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Formatter for current time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Dynamic greeting based on hours
  const getGreeting = () => {
    const hours = time.getHours();
    if (hours < 12) return 'Morning Edition';
    if (hours < 17) return 'Afternoon Edition';
    return 'Evening Edition';
  };

  return (
    <header className="w-full bg-[#030712]/80 border-b border-white/5 relative z-40">
      {/* Top Banner: Date, Clock and Quick Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between border-b border-white/5 gap-3 sm:gap-0">
        {/* Left Side: Date / Clock */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
          <span>{formatDate(time)}</span>
          <span className="text-white/10">|</span>
          <span className="text-slate-200 font-semibold uppercase">{formatTime(time)}</span>
          <span className="text-white/10">|</span>
          <span className="bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
            {getGreeting()}
          </span>
        </div>

        {/* Right Side: Global Interactions */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/40 border border-white/10">
            <span className={`w-1.5 h-1.5 rounded-full ${gnewsApiKey ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500 animate-pulse'}`} />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {gnewsApiKey ? 'GNews Connected' : 'API Key Required'}
            </span>
          </div>

          {/* Bookmarks Toggle button */}
          <Button
            variant={showBookmarksOnly ? 'primary' : 'outline'}
            size="sm"
            onClick={onToggleBookmarksView}
            icon={showBookmarksOnly ? BookmarkCheck : Bookmark}
            className="text-xs relative !py-1 !px-3"
          >
            Bookmarks
            {bookmarks.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                showBookmarksOnly ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
              }`}>
                {bookmarks.length}
              </span>
            )}
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            icon={theme === 'dark' ? Sun : Moon}
            className="text-xs !py-1 !px-2.5"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          />
        </div>
      </div>

      {/* Main Brand Title Column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-2 text-blue-400 font-bold text-xs tracking-widest uppercase">
          <Globe className="w-4 h-4" />
          <span>Independent Editorial Digest</span>
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter leading-none select-none my-1 hover:text-blue-400 transition-colors duration-300">
          THE DAILY GRAVITY
        </h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto my-4 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <p className="max-w-xl mx-auto text-slate-400 text-xs sm:text-sm leading-relaxed italic">
          "A curated catalog of science, industry, technology, and global affairs, structured with absolute objectivity for the modern intellectual."
        </p>
      </div>

      {/* Index ticker footer banner */}
      <div className="relative flex overflow-hidden w-full bg-slate-950/80 border-y border-white/5 py-2.5 backdrop-blur-md select-none">
        <div className="animate-marquee flex gap-12 text-[11px] font-medium tracking-wider text-slate-300">
          <div className="flex gap-12 flex-shrink-0">
            <span className="text-slate-500 font-bold">MARKET REPORT:</span>
            <span>S&P 500 <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+0.82%</strong></span>
            <span>NASDAQ <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+1.45%</strong></span>
            <span>FTSE 100 <strong className="text-rose-400 font-bold drop-shadow-[0_0_4px_rgba(244,63,94,0.35)]">-0.12%</strong></span>
            <span>NIKKEI 225 <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+2.10%</strong></span>
            <span>CRUDE OIL <strong className="text-rose-400 font-bold drop-shadow-[0_0_4px_rgba(244,63,94,0.35)]">-0.95%</strong></span>
            <span>GOLD <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+0.38%</strong></span>
            <span>BTC/USD <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+4.20%</strong></span>
          </div>
          <div className="flex gap-12 flex-shrink-0">
            <span className="text-slate-500 font-bold">MARKET REPORT:</span>
            <span>S&P 500 <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+0.82%</strong></span>
            <span>NASDAQ <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+1.45%</strong></span>
            <span>FTSE 100 <strong className="text-rose-400 font-bold drop-shadow-[0_0_4px_rgba(244,63,94,0.35)]">-0.12%</strong></span>
            <span>NIKKEI 225 <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+2.10%</strong></span>
            <span>CRUDE OIL <strong className="text-rose-400 font-bold drop-shadow-[0_0_4px_rgba(244,63,94,0.35)]">-0.95%</strong></span>
            <span>GOLD <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+0.38%</strong></span>
            <span>BTC/USD <strong className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]">+4.20%</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
