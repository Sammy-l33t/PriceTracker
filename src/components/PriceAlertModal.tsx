import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Product, Store, PriceAlert } from '../types';
import { formatINR, getStoreName } from '../utils/formatters';
import { X, Bell, CheckCircle2, Sparkles, AlertCircle, Send } from 'lucide-react';

interface PriceAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSaveAlert: (alert: PriceAlert) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveAlert,
}) => {
  const minPrice = Math.round(product.overallLowestEver * 0.9);
  const maxPrice = product.currentBestPrice;
  const defaultTarget = Math.round(
    product.currentBestPrice - (product.currentBestPrice - product.overallLowestEver) * 0.5
  );

  const [targetPrice, setTargetPrice] = useState<number>(defaultTarget);
  const [email, setEmail] = useState('');
  const [preferredStore, setPreferredStore] = useState<Store | 'any'>('any');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || targetPrice <= 0) return;

    const newAlert: PriceAlert = {
      id: 'alert-' + Date.now(),
      productId: product.id,
      targetPrice,
      email: email.trim(),
      store: preferredStore,
      createdAt: new Date().toISOString(),
    };

    onSaveAlert(newAlert);
    setIsSuccess(true);

    // Fire joyful celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#3b82f6', '#f43f5e', '#10b981'],
    });

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  const savingsTarget = product.currentBestPrice - targetPrice;
  const savingsPct = Math.round((savingsTarget / product.currentBestPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-100 mb-2">Price Alert Activated!</h3>
            <p className="text-sm text-slate-300 max-w-sm">
              We are now monitoring <strong>{product.title}</strong> across Amazon, Flipkart & Myntra 24/7.
              You will receive an instant email when the price drops to{' '}
              <strong className="text-emerald-400">{formatINR(targetPrice)}</strong> or lower!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Set Price Drop Alert</h3>
                <p className="text-xs text-slate-400">Never miss another flash drop or festival price cut</p>
              </div>
            </div>

            {/* Product summary card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 mb-6">
              <img
                src={product.image}
                alt={product.title}
                className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-800"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{product.title}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-slate-100">
                    Current: {formatINR(product.currentBestPrice)}
                  </span>
                  <span className="text-[11px] text-emerald-400">
                    (Lowest Ever: {formatINR(product.overallLowestEver)})
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Target Alert Price
                  </label>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-400">{formatINR(targetPrice)}</span>
                    {savingsTarget > 0 && (
                      <span className="text-[11px] text-emerald-400 ml-1.5 font-semibold">
                        ({savingsPct}% drop)
                      </span>
                    )}
                  </div>
                </div>

                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={50}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Dream Deal: {formatINR(minPrice)}</span>
                  <span>Current: {formatINR(maxPrice)}</span>
                </div>
              </div>

              {/* Preferred Store */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Store Preference
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'any', label: 'Any Store' },
                    { id: 'amazon', label: 'Amazon' },
                    { id: 'flipkart', label: 'Flipkart' },
                    { id: 'myntra', label: 'Myntra' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferredStore(opt.id as Store | 'any')}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        preferredStore === opt.id
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Notification Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Zero spam guaranteed. We will only email you when the price hits your target threshold.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-slate-950" />
                <span>Confirm Price Drop Alert</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
