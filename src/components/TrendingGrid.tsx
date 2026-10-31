import React, { useState, useMemo } from 'react';
import { Product, Store } from '../types';
import { formatINR, getStoreName, getStoreColor } from '../utils/formatters';
import { Flame, Bookmark, ArrowUpRight, Filter, TrendingDown, Star } from 'lucide-react';

interface TrendingGridProps {
  products: Product[];
  currentProductId: string;
  onSelectProduct: (product: Product) => void;
  watchlistIds: Set<string>;
  onToggleWatchlist: (product: Product) => void;
}

export const TrendingGrid: React.FC<TrendingGridProps> = ({
  products,
  currentProductId,
  onSelectProduct,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<Store | 'All'>('All');
  const [sortBy, setSortBy] = useState<'dealScore' | 'discount' | 'priceAsc' | 'priceDesc'>('dealScore');

  const categories = [
    'All',
    'Smartphones',
    'Audio & Wearables',
    'Laptops & Computers',
    'Fashion & Footwear',
    'Home & Appliances',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (selectedStoreFilter !== 'All') {
          return Boolean(p.stores[selectedStoreFilter]);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dealScore') return b.dealScore - a.dealScore;
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        if (sortBy === 'priceAsc') return a.currentBestPrice - b.currentBestPrice;
        if (sortBy === 'priceDesc') return b.currentBestPrice - a.currentBestPrice;
        return 0;
      });
  }, [products, selectedCategory, selectedStoreFilter, sortBy]);

  return (
    <div className="mt-12 pt-8 border-t border-slate-800/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-100">
              Trending Monitored Deals
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time price drops tracked across Amazon India, Flipkart, and Myntra.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="dealScore">Highest Deal Score</option>
            <option value="discount">Biggest Discount %</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Store pills */}
        <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1 shrink-0 self-start sm:self-auto">
          {(['All', 'amazon', 'flipkart', 'myntra'] as const).map(st => (
            <button
              key={st}
              onClick={() => setSelectedStoreFilter(st)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                selectedStoreFilter === st
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'All' ? 'All Stores' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map(prod => {
          const isSelected = prod.id === currentProductId;
          const isWatchlisted = watchlistIds.has(prod.id);
          const storeColor = getStoreColor(prod.bestStore);

          return (
            <div
              key={prod.id}
              className={`group relative rounded-2xl bg-slate-900/70 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20'
                  : 'border-slate-800/80 hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative aspect-square overflow-hidden bg-slate-950 p-4 flex items-center justify-center">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />

                {/* Best Store Tag */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${storeColor.badgeBg}`}
                  >
                    Lowest on {getStoreName(prod.bestStore).split(' ')[0]}
                  </span>
                  {prod.verdict === 'STEAL_DEAL' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      Steal Deal
                    </span>
                  )}
                </div>

                {/* Bookmark Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(prod);
                  }}
                  title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                    isWatchlisted
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-slate-950' : ''}`} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-400">{prod.brand}</span>
                    <span className="text-[11px] text-slate-500">{prod.category}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                    {prod.title}
                  </h4>

                  {/* Pricing */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-100">
                      {formatINR(prod.currentBestPrice)}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      {formatINR(prod.originalMrp)}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {prod.discountPercent}% OFF
                    </span>
                  </div>

                  {/* Lowest ever tag */}
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Lowest Ever:</span>
                    <span className="font-bold text-emerald-400">
                      {formatINR(prod.overallLowestEver)}
                    </span>
                  </div>
                </div>

                {/* Check Graph CTA button */}
                <button
                  onClick={() => {
                    onSelectProduct(prod);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  <span>{isSelected ? 'Viewing Graph Now' : 'Check Price Graph'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
