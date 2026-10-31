import React from 'react';
import { WatchlistItem, Product } from '../types';
import { formatINR, getStoreName } from '../utils/formatters';
import { X, Bookmark, Trash2, ArrowUpRight, TrendingDown, ExternalLink } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onRemoveItem: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveItem,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Saved Watchlist</h3>
              <p className="text-xs text-slate-400">
                {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} being tracked in your local watchlist
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {watchlist.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-300">Your Watchlist is Empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click the "Bookmark" icon on any product or search result to track its price over time.
              </p>
            </div>
          ) : (
            watchlist.map(item => {
              const diff = item.currentPrice - item.initialPrice;
              const hasDropped = diff < 0;

              return (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(item.productId);
                      onClose();
                    }}
                    className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-slate-200 truncate hover:text-amber-400 transition-colors">
                        {item.productTitle}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-slate-100">
                          {formatINR(item.currentPrice)}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          via {getStoreName(item.store).split(' ')[0]}
                        </span>
                        {diff !== 0 && (
                          <span
                            className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                              hasDropped
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {hasDropped ? `Dropped ${formatINR(Math.abs(diff))}` : `+${formatINR(diff)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        onSelectProduct(item.productId);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Inspect Graph</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      title="Remove from watchlist"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
