import { useState, useEffect } from 'react';
import { X, Key, Info, ExternalLink, RefreshCw } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import Button from '../ui/Button';

/**
 * Settings Modal Component.
 * Enables GNews API Key configuration in a futuristic glassmorphic UI.
 */
export function SettingsModal({ onClose }) {
  const { gnewsApiKey, setGnewsApiKey } = useNews();
  const [key, setKey] = useState(gnewsApiKey);
  const [showKey, setShowKey] = useState(false);

  // Prevent background scrolling when opened
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setGnewsApiKey(key.trim());
    onClose();
  };

  const handleClearKey = () => {
    setKey('');
    setGnewsApiKey('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md glass-modal rounded-2xl shadow-2xl z-10 modal-enter-active overflow-hidden border border-white/10">
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-blue-400" />
            <h2 className="font-serif font-black text-sm uppercase tracking-wider">
              API CONFIGURATION
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Cancel Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Key Input Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                GNews API Key
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[10px] text-blue-400 font-bold uppercase hover:underline cursor-pointer"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative flex items-center glass-input rounded-xl px-3.5 focus-within:bg-white/5 focus-within:border-blue-500/50 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter GNews API Key"
                required
                className="w-full py-3 bg-transparent border-0 outline-none text-[var(--text-primary)] text-sm placeholder:text-slate-600 font-sans"
              />
            </div>

            {/* Link Info */}
            <div className="p-3.5 rounded-xl border border-blue-900/30 bg-blue-950/20 text-[11px] text-blue-300 leading-normal flex items-start gap-2.5 mt-4">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <span>The app queries live headlines using GNews API. Free keys include 100 requests per day. Get a free key at </span>
                <a
                  href="https://gnews.io/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-bold inline-flex items-center gap-0.5"
                >
                  gnews.io
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 gap-3">
            <Button
              variant="text"
              size="sm"
              onClick={handleClearKey}
              icon={RefreshCw}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs !px-3"
            >
              Clear Key
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs !px-3"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="text-xs !px-3"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsModal;
