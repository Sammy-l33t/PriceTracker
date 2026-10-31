import React from 'react';
import { Bookmark, Sparkles, TrendingDown, Layers, ShieldCheck } from 'lucide-react';
import { WatchlistItem } from '../types';

interface HeaderProps {
  watchlist: WatchlistItem[];
  onOpenWatchlist: () => void;
  onSelectBrand?: (brand: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  watchlist,
  onOpenWatchlist,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-blue-600 p-[2px] shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                Price<span className="text-amber-400">Lens</span>
              </span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                India
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Price History & Drop Radar for Amazon • Flipkart • Myntra
            </p>
          </div>
        </div>

        {/* Retailers Supported Badges */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Tracking:</span>
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Amazon
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 font-semibold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Flipkart
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 font-semibold text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Myntra
          </span>
        </div>

        {/* Right side controls: Watchlist */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWatchlist}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all hover:border-slate-700"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Saved Watchlist</span>
            {watchlist.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black">
                {watchlist.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
