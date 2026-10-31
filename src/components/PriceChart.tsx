import React, { useState, useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ScriptableContext,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Product, Store, PricePoint } from '../types';
import { formatINR, formatShortDate, formatDate, getStoreName, getStoreColor } from '../utils/formatters';
import { Download, FileSpreadsheet, TrendingDown, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  product: Product;
  selectedStore: Store | 'all';
  onStoreChange: (store: Store | 'all') => void;
}

type TimeRange = '1M' | '3M' | '6M' | '1Y';

export const PriceChart: React.FC<PriceChartProps> = ({
  product,
  selectedStore,
  onStoreChange,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Filter history points based on timeframe
  const sliceDays = useMemo(() => {
    switch (timeRange) {
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
    }
  }, [timeRange]);

  // Extract store histories
  const storeData = useMemo(() => {
    const stores: Partial<Record<Store, PricePoint[]>> = {};
    if (product.stores.amazon?.history) {
      stores.amazon = product.stores.amazon.history.slice(-sliceDays);
    }
    if (product.stores.flipkart?.history) {
      stores.flipkart = product.stores.flipkart.history.slice(-sliceDays);
    }
    if (product.stores.myntra?.history) {
      stores.myntra = product.stores.myntra.history.slice(-sliceDays);
    }
    return stores;
  }, [product, sliceDays]);

  // Unified labels (dates)
  const labels = useMemo(() => {
    const primary = storeData[selectedStore !== 'all' ? selectedStore : 'amazon'] ||
      storeData.amazon ||
      storeData.flipkart ||
      storeData.myntra ||
      [];
    return primary.map(p => formatShortDate(p.date));
  }, [storeData, selectedStore]);

  // Compute stats for current view
  const currentViewStats = useMemo(() => {
    let prices: number[] = [];
    let lowest = Infinity;
    let lowestDate = '';
    let highest = -Infinity;
    let highestDate = '';
    let current = 0;

    const targetStore = selectedStore !== 'all' ? selectedStore : product.bestStore;
    const offer = product.stores[targetStore];

    if (offer && offer.history) {
      const sliced = offer.history.slice(-sliceDays);
      sliced.forEach(item => {
        prices.push(item.price);
        if (item.price < lowest) {
          lowest = item.price;
          lowestDate = item.date;
        }
        if (item.price > highest) {
          highest = item.price;
          highestDate = item.date;
        }
      });
      current = sliced[sliced.length - 1]?.price || offer.currentPrice;
    } else {
      current = product.currentBestPrice;
      lowest = product.overallLowestEver;
      highest = product.originalMrp;
    }

    const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : current;
    const dropFromHigh = highest > 0 ? Math.round(((highest - current) / highest) * 100) : 0;

    return {
      current,
      lowest: lowest === Infinity ? current : lowest,
      lowestDate,
      highest: highest === -Infinity ? current : highest,
      highestDate,
      average: avg,
      dropFromHigh,
      activeStore: targetStore,
    };
  }, [product, selectedStore, sliceDays]);

  // Notable sales events in current view
  const keyEvents = useMemo(() => {
    const events: { date: string; name: string; price: number; store: Store }[] = [];
    const storesToCheck: Store[] = selectedStore === 'all'
      ? (['amazon', 'flipkart', 'myntra'] as Store[])
      : [selectedStore];

    storesToCheck.forEach(st => {
      const hist = storeData[st];
      if (hist) {
        hist.forEach(pt => {
          if (pt.event && !events.some(e => e.name === pt.event)) {
            events.push({
              date: pt.date,
              name: pt.event,
              price: pt.price,
              store: st,
            });
          }
        });
      }
    });

    return events.slice(-4);
  }, [storeData, selectedStore]);

  // Datasets for Chart.js
  const datasets = useMemo(() => {
    const list = [];

    const buildDataset = (st: Store, label: string, color: string, fill = false) => {
      const data = storeData[st];
      if (!data) return null;

      return {
        label,
        data: data.map(d => d.price),
        borderColor: color,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          if (!fill) return 'transparent';
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, color.replace(')', ', 0.35)').replace('rgb', 'rgba'));
          gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
          return gradient;
        },
        borderWidth: 2.5,
        pointRadius: (ctx: ScriptableContext<'line'>) => {
          const index = ctx.dataIndex;
          const item = data[index];
          return item?.event ? 5 : 0;
        },
        pointHoverRadius: 7,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.35,
        fill: fill,
      };
    };

    if (selectedStore === 'all') {
      if (product.stores.amazon) {
        const ds = buildDataset('amazon', 'Amazon India', '#f59e0b', false);
        if (ds) list.push(ds);
      }
      if (product.stores.flipkart) {
        const ds = buildDataset('flipkart', 'Flipkart', '#3b82f6', false);
        if (ds) list.push(ds);
      }
      if (product.stores.myntra) {
        const ds = buildDataset('myntra', 'Myntra', '#f43f5e', false);
        if (ds) list.push(ds);
      }
    } else {
      const colors: Record<Store, string> = {
        amazon: 'rgb(245, 158, 11)',
        flipkart: 'rgb(59, 130, 246)',
        myntra: 'rgb(244, 63, 94)',
      };
      const ds = buildDataset(selectedStore, getStoreName(selectedStore), colors[selectedStore], true);
      if (ds) list.push(ds);
    }

    return list;
  }, [selectedStore, storeData, product]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: selectedStore === 'all',
        position: 'top',
        align: 'end',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 12, family: 'sans-serif' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#f8fafc',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (items) => {
            const idx = items[0]?.dataIndex;
            const targetStore = selectedStore !== 'all' ? selectedStore : 'amazon';
            const pt = storeData[targetStore]?.[idx];
            return pt ? formatDate(pt.date) : '';
          },
          label: (context) => {
            const val = context.parsed.y ?? 0;
            return ` ${context.dataset.label}: ${formatINR(val)}`;
          },
          afterBody: (items) => {
            const idx = items[0]?.dataIndex;
            const activeStore = selectedStore !== 'all' ? selectedStore : product.bestStore;
            const pt = storeData[activeStore]?.[idx];
            if (pt?.event) {
              return `\n🎉 Sale Event: ${pt.event}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#64748b',
          maxTicksLimit: 8,
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#64748b',
          callback: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
          font: { size: 11 },
        },
      },
    },
  };

  // Download Chart image
  const downloadChartImage = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image('image/png', 1);
    const link = document.createElement('a');
    link.download = `${product.title.replace(/[^a-z0-9]/gi, '_')}_price_history.png`;
    link.href = url;
    link.click();
  };

  // Export CSV
  const exportCSV = () => {
    const store = selectedStore !== 'all' ? selectedStore : product.bestStore;
    const history = product.stores[store]?.history || [];
    let csv = 'Date,Price (INR),MRP (INR),Store,Event\n';
    history.forEach(item => {
      csv += `"${item.date}",${item.price},${item.mrp},"${store}","${item.event || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${product.title.replace(/[^a-z0-9]/gi, '_')}_${store}_prices.csv`);
    link.click();
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Top Header & Store selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingDown className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">Price History Graph</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Tracking price fluctuations across Indian festive seasons and daily retailer updates.
          </p>
        </div>

        {/* Store Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
          <button
            onClick={() => onStoreChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedStore === 'all'
                ? 'bg-gradient-to-r from-amber-500 via-blue-500 to-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Stores Overlay
          </button>

          {product.stores.amazon && (
            <button
              onClick={() => onStoreChange('amazon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedStore === 'amazon'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Amazon
            </button>
          )}

          {product.stores.flipkart && (
            <button
              onClick={() => onStoreChange('flipkart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedStore === 'flipkart'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-blue-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Flipkart
            </button>
          )}

          {product.stores.myntra && (
            <button
              onClick={() => onStoreChange('myntra')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedStore === 'myntra'
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Myntra
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-xs font-medium text-slate-400">Current Price</div>
          <div className="text-xl font-bold text-slate-100 mt-1">
            {formatINR(currentViewStats.current)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            on <span className="font-semibold text-slate-300">{getStoreName(currentViewStats.activeStore)}</span>
          </div>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3.5">
          <div className="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Lowest Ever
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {formatINR(currentViewStats.lowest)}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5 truncate">
            {currentViewStats.lowestDate ? formatDate(currentViewStats.lowestDate) : 'During Festive Sale'}
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-xs font-medium text-slate-400">Average Price</div>
          <div className="text-xl font-bold text-slate-200 mt-1">
            {formatINR(currentViewStats.average)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Based on {sliceDays} days
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-xs font-medium text-slate-400">Highest Ever</div>
          <div className="text-xl font-bold text-rose-400/90 mt-1">
            {formatINR(currentViewStats.highest)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span>MRP: {formatINR(product.originalMrp)}</span>
          </div>
        </div>
      </div>

      {/* Time Filter Controls & Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Time range buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg p-1">
          {(['1M', '3M', '6M', '1Y'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-slate-800 text-amber-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Action Buttons: Export CSV / PNG */}
        <div className="flex items-center gap-2">
          <button
            onClick={downloadChartImage}
            title="Download Chart as PNG"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Chart</span>
          </button>

          <button
            onClick={exportCSV}
            title="Export Price Table to CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* The Line Chart canvas */}
      <div className="w-full h-80 sm:h-96 relative">
        <Line ref={chartRef} data={{ labels, datasets }} options={chartOptions} />
      </div>

      {/* Sale Event highlights underneath */}
      {keyEvents.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800/70">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Historical Festive Drops Detected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {keyEvents.map((evt, i) => {
              const storeColor = getStoreColor(evt.store);
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                >
                  <span className={`w-2 h-2 rounded-full ${storeColor.badgeBg.split(' ')[0]}`} />
                  <span className="font-medium text-slate-200">{evt.name}</span>
                  <span className="font-bold text-emerald-400">{formatINR(evt.price)}</span>
                  <span className="text-[10px] text-slate-500">{formatShortDate(evt.date)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
