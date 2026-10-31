import React from 'react';
import { Product } from '../types';
import { formatINR, getStoreName } from '../utils/formatters';
import { ShieldAlert, ShieldCheck, Flame, Bell, TrendingUp, AlertTriangle } from 'lucide-react';

interface DealVerdictProps {
  product: Product;
  onOpenAlertModal: () => void;
}

export const DealVerdict: React.FC<DealVerdictProps> = ({
  product,
  onOpenAlertModal,
}) => {
  const diffFromLowest = product.currentBestPrice - product.overallLowestEver;
  const savingsVsMrp = product.originalMrp - product.currentBestPrice;

  const getVerdictBadge = () => {
    switch (product.verdict) {
      case 'STEAL_DEAL':
        return {
          title: '🔥 Super Steal Deal',
          color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          barColor: 'bg-emerald-500',
          advice: 'Buy Now! Price is at or near its all-time historical low.',
          icon: <Flame className="w-5 h-5 text-emerald-400" />,
        };
      case 'GOOD_DEAL':
        return {
          title: '✨ Great Deal',
          color: 'bg-teal-500/15 border-teal-500/40 text-teal-400',
          barColor: 'bg-teal-500',
          advice: 'Safe to buy. Price is significantly lower than average.',
          icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
        };
      case 'FAIR_PRICE':
        return {
          title: '⚖️ Fair Regular Price',
          color: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
          barColor: 'bg-amber-500',
          advice: 'Average pricing. If you need it urgently buy now, else wait for next festive sale.',
          icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
        };
      case 'OVERPRICED':
        return {
          title: '🚫 Inflated Price - Wait!',
          color: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
          barColor: 'bg-rose-500',
          advice: 'Do not buy at this price. Price has spiked recently.',
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
        };
    }
  };

  const badge = getVerdictBadge();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700/60">
              {badge.icon}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                AI Buy Verdict
              </span>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {badge.title}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Deal Score</span>
            <div className="text-2xl font-black text-slate-100">
              {product.dealScore}<span className="text-sm font-normal text-slate-500">/100</span>
            </div>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden mb-4 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${badge.barColor}`}
            style={{ width: `${product.dealScore}%` }}
          />
        </div>

        {/* Main Verdict Explanation */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {product.verdictReason}
        </p>

        {/* Fake Discount or Inflation Warning */}
        {product.isFakeDiscount ? (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 mb-4">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Artificial Discount Warning:</span>{' '}
              {product.mrpInflationText || 'The printed MRP appears elevated to exaggerate discount claims.'}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>MRP verified stable. No artificial pre-sale price hikes detected.</span>
          </div>
        )}

        {/* Key Savings Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-5">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Savings vs MRP</span>
            <span className="text-sm font-bold text-emerald-400">
              {formatINR(savingsVsMrp)} ({product.discountPercent}% OFF)
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Gap to All-Time Low</span>
            <span className="text-sm font-bold text-slate-200">
              {diffFromLowest <= 0 ? 'Lowest Ever!' : `+${formatINR(diffFromLowest)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Price Drop Alert Trigger */}
      <button
        onClick={onOpenAlertModal}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
      >
        <Bell className="w-4 h-4 fill-slate-950" />
        <span>Track & Set Price Drop Alert</span>
      </button>
    </div>
  );
};
