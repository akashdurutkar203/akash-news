import { useEffect } from 'react';
import { X, Bookmark, Calendar, User, Clock, ExternalLink } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import Button from '../ui/Button';

/**
 * Article Details Modal.
 * Renders a full article summary with elegant serif typography, metadata, and quick action links.
 */
export function ArticleDetailModal({ article, onClose }) {
  const { isBookmarked, toggleBookmark } = useNews();

  // Block background body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!article) return null;

  const { title, description, content, url, image, publishedAt, sourceName, author, category } = article;
  const bookmarked = isBookmarked(article.id);

  // Dynamic reading time calculation based on average speed (200 words/min)
  const calculateReadingTime = () => {
    const text = `${title} ${description} ${content}`;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  // Formatter for absolute date display
  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card wrapper */}
      <div className="relative w-full max-w-3xl max-h-[85vh] glass-modal rounded-2xl shadow-2xl overflow-y-auto z-10 modal-enter-active flex flex-col border border-white/10">
        
        {/* Banner Cover Image */}
        <div className="relative w-full h-64 md:h-80 bg-slate-950 flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Glassmorphic overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          
          {/* Top Row: category badge & close button */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded shadow-sm">
              {category || 'General'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white/90 border border-white/10 transition-all cursor-pointer shadow-sm hover:scale-105"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Title card in image banner */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block mb-1">
              {sourceName}
            </span>
            <h2 className="text-white font-serif font-bold text-xl md:text-3xl leading-snug line-clamp-2">
              {title}
            </h2>
          </div>
        </div>

        {/* Content Body Pane */}
        <div className="p-6 md:p-8 flex-grow">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-white/10 pb-5 mb-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">
                By <span className="font-semibold text-slate-200">{author || 'Staff Reporter'}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{formatFullDate(publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Est. {calculateReadingTime()} min read</span>
            </div>
          </div>

          {/* Content summary */}
          <div className="prose max-w-none mb-8">
            <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-6 font-sans">
              {content || description}
            </p>
            {/* If content is truncated (common in free API tiers), output a premium notification */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/30 text-xs text-blue-300 leading-normal flex items-start gap-2.5">
              <span className="inline-flex mt-0.5 font-bold uppercase tracking-wider bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded scale-90">Note</span>
              <span>The GNews API returns content snippets. Click the button below to review the full article directly at the original publisher.</span>
            </div>
          </div>

          {/* Bottom Action Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-5 gap-3">
            {/* Bookmark button */}
            <Button
              variant={bookmarked ? 'primary' : 'outline'}
              size="md"
              onClick={() => toggleBookmark(article)}
              icon={Bookmark}
              className="w-full sm:w-auto"
            >
              {bookmarked ? 'Remove Bookmark' : 'Save to Reading List'}
            </Button>

            {/* Read original link */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="md"
                icon={ExternalLink}
                iconPosition="right"
                className="w-full justify-center"
              >
                Read Original Article
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
export default ArticleDetailModal;
