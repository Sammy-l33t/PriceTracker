export type Store = 'amazon' | 'flipkart' | 'myntra';

export interface PricePoint {
  date: string; // ISO date string YYYY-MM-DD
  price: number; // in INR
  mrp: number; // in INR
  event?: string; // e.g. "Big Billion Days", "Great Indian Festival", "EORS"
}

export interface StoreOffer {
  store: Store;
  available: boolean;
  currentPrice: number;
  originalMrp: number;
  lowestEver: number;
  lowestEverDate: string;
  highestEver: number;
  highestEverDate: string;
  averagePrice: number;
  rating: number;
  reviewCount: number;
  seller: string;
  deliveryText: string;
  bankOffer?: string;
  couponText?: string;
  productUrl: string;
  history: PricePoint[];
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'Smartphones' | 'Laptops & Computers' | 'Audio & Wearables' | 'Fashion & Footwear' | 'Home & Appliances';
  image: string;
  specs: string[];
  bestStore: Store;
  currentBestPrice: number;
  originalMrp: number;
  discountPercent: number;
  overallLowestEver: number;
  overallLowestStore: Store;
  stores: {
    amazon?: StoreOffer;
    flipkart?: StoreOffer;
    myntra?: StoreOffer;
  };
  dealScore: number; // 0 - 100
  verdict: 'STEAL_DEAL' | 'GOOD_DEAL' | 'FAIR_PRICE' | 'OVERPRICED';
  verdictReason: string;
  isFakeDiscount: boolean;
  mrpInflationText?: string;
}

export interface WatchlistItem {
  productId: string;
  productTitle: string;
  productImage: string;
  category: string;
  targetPrice: number;
  initialPrice: number;
  currentPrice: number;
  store: Store;
  addedAt: string;
  email?: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  targetPrice: number;
  email: string;
  phone?: string;
  store: Store | 'any';
  createdAt: string;
}
