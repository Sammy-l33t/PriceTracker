import React from 'react';
import { Product, Store, StoreOffer } from '../types';
import { formatINR, getStoreName, getStoreColor } from '../utils/formatters';
import { ExternalLink, CheckCircle2, Trophy, Tag, CreditCard, Truck, Star } from 'lucide-react';

interface StoreComparisonProps {
  product: Product;
  onSelectStoreChart: (store: Store) => void;
}

export const StoreComparison: React.FC<StoreComparisonProps> = ({
  product,
  onSelectStoreChart,
}) => {
  const storeKeys: Store[] = ['amazon', 'flipkart', 'myntra'];
  const availableOffers = storeKeys
    .map(key => product.stores[key])
    .filter((offer): offer is StoreOffer => Boolean(offer));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Store Comparison</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Live Rates
            </span>
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Compare prices, bank offers, and delivery terms across Amazon, Flipkart, and Myntra.
          </p>
        </div>

        {product.bestStore && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Cheapest Store: {getStoreName(product.bestStore)}</span>
          </div>
        )}
      </div>

      {/* Grid of Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {storeKeys.map(storeKey => {
          const offer = product.stores[storeKey];
          const isWinner = product.bestStore === storeKey;
          const storeColor = getStoreColor(storeKey);

          if (!offer) {
            return (
              <div
                key={storeKey}
                className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-5 flex flex-col items-center justify-center text-center opacity-60 min-h-[300px]"
              >
                <div className={`w-3 h-3 rounded-full mb-2 ${storeColor.badgeBg.split(' ')[0]}`} />
                <h4 className="font-bold text-slate-300">{getStoreName(storeKey)}</h4>
                <p className="text-xs text-slate-500 mt-2">
                  Currently Out of Stock or Not Cataloged by this retailer.
                </p>
              </div>
            );
          }

          const discount = Math.round(((offer.originalMrp - offer.currentPrice) / offer.originalMrp) * 100);

          return (
            <div
              key={storeKey}
              className={`relative rounded-xl p-5 flex flex-col justify-between transition-all duration-200 border ${
                isWinner
                  ? 'bg-slate-950/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Winner ribbon badge */}
              {isWinner && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Trophy className="w-3 h-3 fill-slate-950" />
                  Best Price
                </div>
              )}

              <div>
                {/* Store Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${storeColor.badgeBg.split(' ')[0]}`} />
                    <h4 className="font-bold text-slate-100">{getStoreName(storeKey)}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{offer.rating}</span>
                    <span className="text-slate-500 text-[10px]">({offer.reviewCount.toLocaleString()})</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-50">
                      {formatINR(offer.currentPrice)}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      {formatINR(offer.originalMrp)}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {discount}% OFF
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Seller: <span className="text-slate-300 font-medium">{offer.seller}</span>
                  </div>
                </div>

                {/* Store Price Bounds */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 rounded-lg bg-slate-900/80 border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Lowest Ever</span>
                    <span className="font-bold text-emerald-400">{formatINR(offer.lowestEver)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Highest Ever</span>
                    <span className="font-bold text-slate-400">{formatINR(offer.highestEver)}</span>
                  </div>
                </div>

                {/* Bank / Coupon Offer */}
                <div className="space-y-2 mb-4">
                  {offer.bankOffer && (
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{offer.bankOffer}</span>
                    </div>
                  )}

                  {offer.couponText && (
                    <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                      <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-semibold">{offer.couponText}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{offer.deliveryText}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <a
                  href={offer.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isWinner
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>Buy on {getStoreName(storeKey).split(' ')[0]}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onSelectStoreChart(storeKey)}
                  className="w-full py-1.5 text-[11px] text-slate-400 hover:text-slate-200 font-medium text-center transition-colors"
                >
                  Inspect {getStoreName(storeKey).split(' ')[0]} Graph Details &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
