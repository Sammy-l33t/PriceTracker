import React, { useState } from 'react';
import { Search, Link as LinkIcon, Sparkles, X, ArrowRight } from 'lucide-react';
import { detectStoreFromUrl } from '../utils/priceGenerator';
import { getStoreName } from '../utils/formatters';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [inputVal, setInputVal] = useState('');
  const detectedStore = detectStoreFromUrl(inputVal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const sampleQueries = [
    { label: 'iPhone 15', query: 'Apple iPhone 15', store: 'Amazon & Flipkart' },
    { label: 'Sony WH-1000XM5', query: 'Sony WH-1000XM5', store: 'Amazon' },
    { label: 'Nike Pegasus 40', query: 'Nike Men Air Zoom Pegasus 40', store: 'Myntra Best Price' },
    { label: "Levi's 511 Jeans", query: "Levi's Men 511 Slim", store: 'Myntra 58% Off' },
    { label: 'Samsung Galaxy S24', query: 'Samsung Galaxy S24', store: 'Flipkart' },
    { label: 'boAt Airdopes 141', query: 'boAt Airdopes 141', store: '₹899 Deal' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-slate-900/90 border-2 border-slate-700/80 hover:border-amber-500/50 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20 rounded-2xl shadow-2xl transition-all overflow-hidden p-1.5 sm:p-2 backdrop-blur-xl">
          {/* Leading Icon / Store badge */}
          <div className="pl-3 pr-2 text-slate-400 flex items-center">
            {detectedStore ? (
              <span
                className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${
                  detectedStore === 'amazon'
                    ? 'bg-amber-500 text-slate-950'
                    : detectedStore === 'flipkart'
                    ? 'bg-blue-600 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {getStoreName(detectedStore).split(' ')[0]} URL
              </span>
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          {/* Input field */}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Paste any Amazon, Flipkart, or Myntra product link, or type a product name..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base px-2 py-2.5 sm:py-3 focus:outline-none"
          />

          {/* Clear button */}
          {inputVal && (
            <button
              type="button"
              onClick={() => setInputVal('')}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg mr-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline">Track Price</span>
                <span className="sm:hidden">Track</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Try Sample Chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Quick Try:
        </span>
        {sampleQueries.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputVal(item.query);
              onSearch(item.query);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all hover:scale-105"
          >
            <span className="font-semibold">{item.label}</span>
            <span className="text-[10px] text-amber-400/90 font-mono">({item.store})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
