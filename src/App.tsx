import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { Product, Store, WatchlistItem, PriceAlert } from './types';
import { parseProductUrlOrQuery, synthesizeProductFromCustomInput } from './utils/priceGenerator';
import { formatINR, getStoreName, getStoreColor } from './utils/formatters';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PriceChart } from './components/PriceChart';
import { DealVerdict } from './components/DealVerdict';
import { StoreComparison } from './components/StoreComparison';
import { TrendingGrid } from './components/TrendingGrid';
import { PriceAlertModal } from './components/PriceAlertModal';
import { WatchlistModal } from './components/WatchlistModal';
import { Footer } from './components/Footer';
import { Bookmark, Sparkles, Check, Share2, AlertCircle, ShoppingBag } from 'lucide-react';

export const App: React.FC = () => {
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [activeProduct, setActiveProduct] = useState<Product>(MOCK_PRODUCTS[0]);
  const [selectedChartStore, setSelectedChartStore] = useState<Store | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Watchlist state (persisted to localStorage)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('pricelens_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pricelens_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  const watchlistIds = new Set(watchlist.map(w => w.productId));

  // Toggle item in watchlist
  const handleToggleWatchlist = (product: Product) => {
    if (watchlistIds.has(product.id)) {
      setWatchlist(prev => prev.filter(w => w.productId !== product.id));
    } else {
      const newItem: WatchlistItem = {
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        category: product.category,
        targetPrice: product.currentBestPrice,
        initialPrice: product.currentBestPrice,
        currentPrice: product.currentBestPrice,
        store: product.bestStore,
        addedAt: new Date().toISOString(),
      };
      setWatchlist(prev => [newItem, ...prev]);
    }
  };

  const handleRemoveFromWatchlist = (productId: string) => {
    setWatchlist(prev => prev.filter(w => w.productId !== productId));
  };

  const handleSelectFromWatchlist = (productId: string) => {
    const found = productsList.find(p => p.id === productId);
    if (found) {
      setActiveProduct(found);
      setSelectedChartStore('all');
    }
  };

  // Search or URL paste handler
  const handleSearch = (query: string) => {
    setIsLoading(true);
    setSearchFeedback(null);

    setTimeout(() => {
      const parsed = parseProductUrlOrQuery(query);

      // Check if matches an existing item in catalog
      const matched = productsList.find(p => {
        const titleMatch = p.title.toLowerCase().includes(parsed.cleanTitle.toLowerCase());
        const idMatch = p.id.toLowerCase().includes(parsed.identifier.toLowerCase());
        const brandMatch = p.brand.toLowerCase().includes(parsed.cleanTitle.toLowerCase());
        return titleMatch || idMatch || brandMatch;
      });

      if (matched) {
        setActiveProduct(matched);
        setSelectedChartStore('all');
        setSearchFeedback(`Loaded tracked price data for ${matched.title.substring(0, 40)}...`);
      } else {
        // Synthesize dynamic product based on user input / link
        const customProduct = synthesizeProductFromCustomInput(query, parsed.store, parsed.cleanTitle);
        setProductsList(prev => [customProduct, ...prev]);
        setActiveProduct(customProduct);
        setSelectedChartStore('all');
        setSearchFeedback(
          parsed.isUrl
            ? `Analyzed ${getStoreName(parsed.store || 'amazon')} URL and synthesized 365-day historical tracking curve!`
            : `Generated 365-day price history model for "${parsed.cleanTitle}".`
        );
      }

      setIsLoading(false);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 450);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2000);
    }
  };

  const bestStoreColor = getStoreColor(activeProduct.bestStore);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Navigation Header */}
      <Header
        watchlist={watchlist}
        onOpenWatchlist={() => setIsWatchlistModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Store Price Tracker • Amazon • Flipkart • Myntra</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 leading-tight">
            Check Real Price History &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              Never Overpay Again
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Paste any product link or search keywords to inspect all-time price drops, detect fake festival discounts, and see which store is cheapest right now.
          </p>

          {/* Search Bar */}
          <div className="mt-6 sm:mt-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Notification feedback */}
          {searchFeedback && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fade-in">
              <Check className="w-4 h-4" />
              <span>{searchFeedback}</span>
            </div>
          )}
        </div>

        {/* Active Product Showcase */}
        <section className="mt-6 space-y-6">
          {/* Active Product Headline Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1">
              {/* Product Thumbnail */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 p-2 border border-slate-800 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {activeProduct.brand}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {activeProduct.category}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded ${bestStoreColor.badgeBg}`}>
                    Cheapest on {getStoreName(activeProduct.bestStore).split(' ')[0]}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-slate-100 leading-snug line-clamp-2">
                  {activeProduct.title}
                </h2>

                {/* Specs pills */}
                <div className="hidden sm:flex flex-wrap items-center gap-1.5 mt-2.5">
                  {activeProduct.specs.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-950/70 text-slate-400 border border-slate-800"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions (Bookmark / Share) */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
              <button
                onClick={() => handleToggleWatchlist(activeProduct)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  watchlistIds.has(activeProduct.id)
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${watchlistIds.has(activeProduct.id) ? 'fill-slate-950' : ''}`} />
                <span>{watchlistIds.has(activeProduct.id) ? 'Saved' : 'Track in Watchlist'}</span>
              </button>

              <button
                onClick={handleShare}
                title="Share link"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors relative"
              >
                <Share2 className="w-4 h-4" />
                {copyNotification && (
                  <span className="absolute -top-8 right-0 bg-slate-800 text-amber-400 text-[10px] font-bold px-2 py-1 rounded shadow whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Graph & AI Verdict Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* The Price History Graph (takes 2 cols) */}
            <div className="lg:col-span-2">
              <PriceChart
                product={activeProduct}
                selectedStore={selectedChartStore}
                onStoreChange={setSelectedChartStore}
              />
            </div>

            {/* AI Deal Verdict & Alert Trigger (takes 1 col) */}
            <div className="lg:col-span-1 h-full">
              <DealVerdict
                product={activeProduct}
                onOpenAlertModal={() => setIsAlertModalOpen(true)}
              />
            </div>
          </div>

          {/* Store Comparison Cards */}
          <div>
            <StoreComparison
              product={activeProduct}
              onSelectStoreChart={(store) => {
                setSelectedChartStore(store);
                window.scrollTo({ top: 340, behavior: 'smooth' });
              }}
            />
          </div>
        </section>

        {/* Trending Deals Catalog */}
        <section>
          <TrendingGrid
            products={productsList}
            currentProductId={activeProduct.id}
            onSelectProduct={(product) => {
              setActiveProduct(product);
              setSelectedChartStore('all');
            }}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </section>
      </main>

      {/* Modals */}
      <PriceAlertModal
        product={activeProduct}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSaveAlert={(alert) => {
          // Alert saved handler
        }}
      />

      <WatchlistModal
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        watchlist={watchlist}
        onRemoveItem={handleRemoveFromWatchlist}
        onSelectProduct={handleSelectFromWatchlist}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
