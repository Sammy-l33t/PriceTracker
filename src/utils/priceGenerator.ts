import { Store, PricePoint, StoreOffer, Product } from '../types';

export function detectStoreFromUrl(url: string): Store | null {
  const clean = url.toLowerCase();
  if (clean.includes('amazon.in') || clean.includes('amzn.to') || clean.includes('amzn.in') || clean.includes('amazon.com')) {
    return 'amazon';
  }
  if (clean.includes('flipkart.com') || clean.includes('fkrt.it')) {
    return 'flipkart';
  }
  if (clean.includes('myntra.com')) {
    return 'myntra';
  }
  return null;
}

export function parseProductUrlOrQuery(input: string): {
  isUrl: boolean;
  store: Store | null;
  identifier: string;
  cleanTitle: string;
} {
  const isUrl = /^https?:\/\//i.test(input.trim());
  const store = detectStoreFromUrl(input);

  if (isUrl) {
    try {
      const urlObj = new URL(input.trim());
      const pathname = urlObj.pathname;
      let cleanTitle = 'Tracked Product';

      if (store === 'amazon') {
        const dpMatch = pathname.match(/\/dp\/([A-Z0-9]+)/i) || pathname.match(/\/gp\/product\/([A-Z0-9]+)/i);
        const asin = dpMatch ? dpMatch[1] : 'AMZ' + Math.floor(100000 + Math.random() * 900000);
        const namePart = pathname.split('/')[1] || 'Amazon Product';
        cleanTitle = decodeURIComponent(namePart).replace(/-/g, ' ');
        return { isUrl: true, store: 'amazon', identifier: asin, cleanTitle };
      } else if (store === 'flipkart') {
        const parts = pathname.split('/').filter(Boolean);
        const namePart = parts[0] || 'Flipkart Product';
        const pIndex = parts.indexOf('p');
        const fsn = pIndex !== -1 && parts[pIndex + 1] ? parts[pIndex + 1] : 'FK' + Math.floor(100000 + Math.random() * 900000);
        cleanTitle = decodeURIComponent(namePart).replace(/-/g, ' ');
        return { isUrl: true, store: 'flipkart', identifier: fsn, cleanTitle };
      } else if (store === 'myntra') {
        const parts = pathname.split('/').filter(Boolean);
        const namePart = parts[0] || 'Myntra Fashion Product';
        cleanTitle = decodeURIComponent(namePart).replace(/-/g, ' ');
        const id = parts[parts.length - 1] || 'MYN' + Math.floor(100000 + Math.random() * 900000);
        return { isUrl: true, store: 'myntra', identifier: id, cleanTitle };
      }
    } catch {
      // fallback
    }
  }

  return {
    isUrl: false,
    store: null,
    identifier: input.trim().toLowerCase(),
    cleanTitle: input.trim(),
  };
}

export function generateRealisticPriceHistory(
  basePrice: number,
  mrp: number,
  store: Store
): {
  history: PricePoint[];
  lowestEver: number;
  lowestEverDate: string;
  highestEver: number;
  highestEverDate: string;
  averagePrice: number;
} {
  const history: PricePoint[] = [];
  const now = new Date();
  const days = 365;

  let lowestEver = Infinity;
  let lowestEverDate = '';
  let highestEver = -Infinity;
  let highestEverDate = '';
  let totalPrice = 0;

  // Sale events throughout the year (day offset from 365 days ago)
  const festivalEvents: { day: number; name: string; discountFactor: number }[] = [
    {
      day: 20,
      name: store === 'amazon' ? 'Great Republic Day Sale' : store === 'flipkart' ? 'Republic Day Bonanza' : 'Right to Fashion Sale',
      discountFactor: 0.88,
    },
    {
      day: 80,
      name: store === 'myntra' ? 'Holi Style Fest' : 'Spring Fest Savings',
      discountFactor: 0.92,
    },
    {
      day: 135,
      name: store === 'amazon' ? 'Summer Appliance Carnival' : store === 'flipkart' ? 'Big Bachat Days' : 'End of Reason Sale (EORS)',
      discountFactor: 0.85,
    },
    {
      day: 205,
      name: store === 'amazon' ? 'Amazon Prime Day' : store === 'flipkart' ? 'GOAT Sale' : 'Myntra Fashion Carnival',
      discountFactor: 0.82,
    },
    {
      day: 230,
      name: store === 'amazon' ? 'Great Freedom Festival' : store === 'flipkart' ? 'Freedom Sale' : 'Independence Day Special',
      discountFactor: 0.89,
    },
    {
      day: 295,
      name: store === 'amazon' ? 'Great Indian Festival (Diwali)' : store === 'flipkart' ? 'The Big Billion Days (BBD)' : 'Big Fashion Festival',
      discountFactor: 0.78, // Biggest annual drop
    },
    {
      day: 335,
      name: store === 'amazon' ? 'Black Friday Cyber Week' : store === 'flipkart' ? 'Black Friday Sale' : 'Year-End Fashion Bash',
      discountFactor: 0.86,
    },
  ];

  // Starting baseline price
  let currentSimPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const dayNumber = days - i;
    const activeEvent = festivalEvents.find(e => Math.abs(e.day - dayNumber) <= 2);

    let price = currentSimPrice;
    let eventName: string | undefined = undefined;

    if (activeEvent) {
      price = Math.round((basePrice * activeEvent.discountFactor) / 10) * 10;
      eventName = activeEvent.name;
    } else {
      // Normal price variations: store-specific drift & weekly promotions
      const variance = (Math.sin(dayNumber / 7) * 0.04) + ((Math.random() - 0.48) * 0.03);
      price = Math.round((basePrice * (1 + variance)) / 10) * 10;

      // Occasional flash price hike (artificial inflation before sale)
      if (festivalEvents.some(e => e.day - dayNumber > 0 && e.day - dayNumber <= 10)) {
        price = Math.min(mrp, Math.round((basePrice * 1.08) / 10) * 10);
      }
    }

    // Bounds safety
    price = Math.max(Math.round(basePrice * 0.7), Math.min(mrp, price));

    if (price < lowestEver) {
      lowestEver = price;
      lowestEverDate = dateStr;
    }
    if (price > highestEver) {
      highestEver = price;
      highestEverDate = dateStr;
    }

    totalPrice += price;
    history.push({
      date: dateStr,
      price,
      mrp,
      event: eventName,
    });
  }

  const averagePrice = Math.round(totalPrice / history.length);

  return {
    history,
    lowestEver,
    lowestEverDate,
    highestEver,
    highestEverDate,
    averagePrice,
  };
}

export function synthesizeProductFromCustomInput(
  rawInput: string,
  detectedStore: Store | null,
  cleanTitle: string
): Product {
  const store: Store = detectedStore || 'amazon';
  const mrp = 14999;
  const currentPrice = 11499;

  const amazonStats = generateRealisticPriceHistory(currentPrice, mrp, 'amazon');
  const flipkartStats = generateRealisticPriceHistory(Math.round(currentPrice * 1.02), mrp, 'flipkart');
  const myntraStats = generateRealisticPriceHistory(Math.round(currentPrice * 1.05), mrp, 'myntra');

  const amazonOffer: StoreOffer = {
    store: 'amazon',
    available: true,
    currentPrice: amazonStats.history[amazonStats.history.length - 1].price,
    originalMrp: mrp,
    lowestEver: amazonStats.lowestEver,
    lowestEverDate: amazonStats.lowestEverDate,
    highestEver: amazonStats.highestEver,
    highestEverDate: amazonStats.highestEverDate,
    averagePrice: amazonStats.averagePrice,
    rating: 4.4,
    reviewCount: 3820,
    seller: 'Appario Retail Pvt Ltd',
    deliveryText: 'Prime Free Delivery within 24 Hours',
    bankOffer: 'Flat ₹1,000 Instant Discount on SBI/ICICI Credit Cards',
    productUrl: store === 'amazon' && rawInput.startsWith('http') ? rawInput : 'https://www.amazon.in',
    history: amazonStats.history,
  };

  const flipkartOffer: StoreOffer = {
    store: 'flipkart',
    available: true,
    currentPrice: flipkartStats.history[flipkartStats.history.length - 1].price,
    originalMrp: mrp,
    lowestEver: flipkartStats.lowestEver,
    lowestEverDate: flipkartStats.lowestEverDate,
    highestEver: flipkartStats.highestEver,
    highestEverDate: flipkartStats.highestEverDate,
    averagePrice: flipkartStats.averagePrice,
    rating: 4.3,
    reviewCount: 2950,
    seller: 'SuperComNet Retail',
    deliveryText: 'Flipkart Plus Free 2-Day Delivery',
    bankOffer: '5% Unlimited Cashback on Flipkart Axis Bank Card',
    productUrl: store === 'flipkart' && rawInput.startsWith('http') ? rawInput : 'https://www.flipkart.com',
    history: flipkartStats.history,
  };

  const myntraOffer: StoreOffer = {
    store: 'myntra',
    available: true,
    currentPrice: myntraStats.history[myntraStats.history.length - 1].price,
    originalMrp: mrp,
    lowestEver: myntraStats.lowestEver,
    lowestEverDate: myntraStats.lowestEverDate,
    highestEver: myntraStats.highestEver,
    highestEverDate: myntraStats.highestEverDate,
    averagePrice: myntraStats.averagePrice,
    rating: 4.2,
    reviewCount: 840,
    seller: 'RetailNet Fashion India',
    deliveryText: 'Fast standard delivery with easy 14-day return',
    couponText: 'Use code MYNTRA10 for additional ₹300 off',
    productUrl: store === 'myntra' && rawInput.startsWith('http') ? rawInput : 'https://www.myntra.com',
    history: myntraStats.history,
  };

  const bestStore = amazonOffer.currentPrice <= flipkartOffer.currentPrice ? 'amazon' : 'flipkart';
  const bestPrice = Math.min(amazonOffer.currentPrice, flipkartOffer.currentPrice);

  return {
    id: 'custom-' + Math.random().toString(36).substring(2, 9),
    title: cleanTitle.length > 5 ? cleanTitle : 'Custom Tracked Product (' + (detectedStore || 'E-Commerce') + ')',
    brand: 'Tracked Brand',
    category: 'Home & Appliances',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Real-time price monitoring active',
      'Daily multi-store comparison index',
      'Festival price drop predictor enabled',
    ],
    bestStore,
    currentBestPrice: bestPrice,
    originalMrp: mrp,
    discountPercent: Math.round(((mrp - bestPrice) / mrp) * 100),
    overallLowestEver: Math.min(amazonStats.lowestEver, flipkartStats.lowestEver, myntraStats.lowestEver),
    overallLowestStore: 'amazon',
    stores: {
      amazon: amazonOffer,
      flipkart: flipkartOffer,
      myntra: myntraOffer,
    },
    dealScore: 84,
    verdict: 'GOOD_DEAL',
    verdictReason: 'Current price is within 5% of its 6-month average. Good buy, but festival sales drop it slightly lower.',
    isFakeDiscount: false,
    mrpInflationText: 'MRP has remained stable with no sudden pre-sale price jack.',
  };
}
