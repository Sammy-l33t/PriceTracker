import React from 'react';
import { TrendingDown, ShieldCheck, Zap, Calendar, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800/80">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-slate-100">
                Price<span className="text-amber-400">Lens</span> India
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time multi-store price tracker engineered for Indian shoppers. We analyze price changes, uncover artificial festive discounts, and help you buy at the all-time lowest rate across Amazon, Flipkart, and Myntra.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Indian Festival Sale Radar</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li><strong className="text-slate-300">Jan:</strong> Republic Day Bonanza & Great Republic Sale</li>
              <li><strong className="text-slate-300">May/Jun:</strong> Myntra End of Reason Sale (EORS)</li>
              <li><strong className="text-slate-300">Jul/Aug:</strong> Amazon Prime Day & Freedom Festivals</li>
              <li><strong className="text-slate-300">Oct/Nov:</strong> The Big Billion Days & Great Indian Festival</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Smart Buyer Guarantees</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We detect fake MRP markup hikes before major sales events. Our Deal Verdict algorithms calculate the actual historical price delta so you never get tricked by inflated discounts.
            </p>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2024-2026 PriceLens. All product names, logos, and brands are property of their respective owners.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for smart Indian online shoppers</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
