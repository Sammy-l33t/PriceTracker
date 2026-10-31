import { Product, StoreOffer } from '../types';
import { generateRealisticPriceHistory } from '../utils/priceGenerator';

// Helper to create store offer
function makeStoreOffer(
  store: 'amazon' | 'flipkart' | 'myntra',
  currentPrice: number,
  mrp: number,
  rating: number,
  reviewCount: number,
  seller: string,
  deliveryText: string,
  url: string,
  bankOffer?: string,
  couponText?: string
): StoreOffer {
  const stats = generateRealisticPriceHistory(currentPrice, mrp, store);
  return {
    store,
    available: true,
    currentPrice: stats.history[stats.history.length - 1].price,
    originalMrp: mrp,
    lowestEver: stats.lowestEver,
    lowestEverDate: stats.lowestEverDate,
    highestEver: stats.highestEver,
    highestEverDate: stats.highestEverDate,
    averagePrice: stats.averagePrice,
    rating,
    reviewCount,
    seller,
    deliveryText,
    bankOffer,
    couponText,
    productUrl: url,
    history: stats.history,
  };
}

// 1. Apple iPhone 15 (128GB - Black)
const iphoneAmazon = makeStoreOffer(
  'amazon',
  64999,
  79900,
  4.6,
  12850,
  'Appario Retail Pvt Ltd',
  'FREE One-Day Prime Delivery',
  'https://www.amazon.in/dp/B0CHX1W1XY',
  'Flat ₹4,000 Instant Discount on HDFC Bank Cards',
  undefined
);
const iphoneFlipkart = makeStoreOffer(
  'flipkart',
  63999,
  79900,
  4.7,
  44920,
  'SuperComNet Retail',
  'Plus Member Free Express Delivery in 24 hrs',
  'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4',
  '₹5,000 off on Axis Bank & SBI Credit Cards'
);

// 2. Sony WH-1000XM5 Wireless ANC Headphones
const sonyAmazon = makeStoreOffer(
  'amazon',
  26990,
  34990,
  4.6,
  8240,
  'Appario Retail',
  'Prime Delivery by Tomorrow 11 AM',
  'https://www.amazon.in/dp/B09XS7JWHH',
  '₹2,500 Coupon applied at checkout + ₹1,500 Bank off',
  'Apply ₹2,500 coupon'
);
const sonyFlipkart = makeStoreOffer(
  'flipkart',
  28490,
  34990,
  4.5,
  6120,
  'IndiFlash Mart',
  'Delivery in 2 Days',
  'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm2278e35ab0248',
  'Extra ₹1,500 off on ICICI Credit Cards'
);

// 3. Apple MacBook Air M2 (8GB / 256GB SSD)
const macbookAmazon = makeStoreOffer(
  'amazon',
  87990,
  99900,
  4.7,
  5140,
  'Appario Retail',
  'FREE Scheduled Delivery with Open Box inspection',
  'https://www.amazon.in/dp/B0B3C9F8J2',
  'Flat ₹5,000 Instant Discount on ICICI Bank Cards'
);
const macbookFlipkart = makeStoreOffer(
  'flipkart',
  89990,
  99900,
  4.7,
  3890,
  'SuperComNet Retail',
  'Fast delivery by tomorrow',
  'https://www.flipkart.com/apple-2022-macbook-air-m2-8-gb-256-gb-ssd/p/itm54b2d18b3400a',
  'Flat ₹4,000 Cashback on Flipkart Axis Card'
);

// 4. Samsung Galaxy S24 5G (8GB / 128GB)
const samsungAmazon = makeStoreOffer(
  'amazon',
  62999,
  79999,
  4.5,
  4380,
  'STPL Exclusive',
  'Prime Next Day Delivery',
  'https://www.amazon.in/dp/B0CQ2CSTP9',
  '₹5,000 Upgrade Bonus on exchange + ₹3,000 HDFC off'
);
const samsungFlipkart = makeStoreOffer(
  'flipkart',
  61999,
  79999,
  4.6,
  7920,
  'RetailNet',
  'Plus 2-day delivery with free installation guidance',
  'https://www.flipkart.com/samsung-galaxy-s24-5g-amber-yellow-128-gb/p/itmd06689d71a179',
  '₹5,000 instant discount on all major credit cards'
);

// 5. Nike Air Zoom Pegasus 40 Running Shoes (Available on Amazon, Flipkart & Myntra!)
const nikeAmazon = makeStoreOffer(
  'amazon',
  8495,
  11495,
  4.4,
  1450,
  'Nike Authorized Store India',
  'Prime Delivery in 2 days',
  'https://www.amazon.in/dp/B0BYS72P3L',
  '10% Instant discount on ICICI cards'
);
const nikeFlipkart = makeStoreOffer(
  'flipkart',
  8195,
  11495,
  4.3,
  980,
  'TrueCom Retails',
  'Delivery in 3 days with easy size exchange',
  'https://www.flipkart.com/nike-air-zoom-pegasus-40-running-shoes/p/itm914f6bca4',
  'Extra ₹500 off on UPI transactions'
);
const nikeMyntra = makeStoreOffer(
  'myntra',
  7471,
  11495,
  4.5,
  3420,
  'Nike India Retail Partner',
  'Myntra Express Delivery + 14-day hassle free return & exchange',
  'https://www.myntra.com/sports-shoes/nike/nike-men-air-zoom-pegasus-40/23491820/buy',
  'Flat 35% OFF + Extra 10% coupon code: RUNNER10',
  'Coupon RUNNER10 for extra ₹750 off'
);

// 6. Levi's 511 Slim Fit Mid-Rise Jeans (Available on Amazon, Flipkart, Myntra)
const levisAmazon = makeStoreOffer(
  'amazon',
  1999,
  3999,
  4.2,
  3410,
  'Levi Strauss India Pvt Ltd',
  'FREE Delivery by tomorrow for Prime',
  'https://www.amazon.in/dp/B07YV35XLP',
  '5% back on Amazon Pay ICICI Card'
);
const levisFlipkart = makeStoreOffer(
  'flipkart',
  1899,
  3999,
  4.3,
  5620,
  'OmniTech Retails',
  'Delivery in 2-3 business days',
  'https://www.flipkart.com/levi-s-511-slim-men-blue-jeans/p/itmfd9471f28b4c2',
  'Buy 2 get additional 10% off'
);
const levisMyntra = makeStoreOffer(
  'myntra',
  1679,
  3999,
  4.4,
  8910,
  'Levi Strauss Official Flagship Store',
  'Myntra Insider Fast 24-hr Dispatch + Easy Exchange',
  'https://www.myntra.com/jeans/levis/levis-men-blue-511-slim-fit-stretchable-jeans/1129481/buy',
  'Insider Special: 58% off + 15% coupon code: STYLE15',
  'Use coupon STYLE15'
);

// 7. Dyson V12 Detect Slim Total Clean Cordless Vacuum
const dysonAmazon = makeStoreOffer(
  'amazon',
  46900,
  55900,
  4.6,
  1830,
  'Dyson India Official',
  'White-glove demo delivery in 2 days',
  'https://www.amazon.in/dp/B0B657QWPL',
  'Flat ₹4,000 off on HDFC & Axis bank credit cards'
);
const dysonFlipkart = makeStoreOffer(
  'flipkart',
  48900,
  55900,
  4.5,
  890,
  'Dyson Authorized Flipkart Mall',
  'Fast delivery + free home demonstration',
  'https://www.flipkart.com/dyson-v12-detect-slim-cordless-vacuum-cleaner/p/itm53ab67ef38b1',
  'No Cost EMI starting from ₹4,075/month'
);

// 8. boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds
const boatAmazon = makeStoreOffer(
  'amazon',
  999,
  4490,
  4.0,
  218400,
  'Imagine Marketing Pvt Ltd (boAt)',
  'Same-day Prime delivery available',
  'https://www.amazon.in/dp/B09N3ZNHTY',
  'Flat ₹50 cashback on Amazon Pay UPI'
);
const boatFlipkart = makeStoreOffer(
  'flipkart',
  899,
  4490,
  4.1,
  189300,
  'FlashTech Electronics',
  'Delivery by tomorrow morning',
  'https://www.flipkart.com/boat-airdopes-141-bluetooth-headset/p/itme9ef43c983cbf',
  'Extra ₹100 off on combo purchase with boAt case'
);
const boatMyntra = makeStoreOffer(
  'myntra',
  1099,
  4490,
  4.1,
  14320,
  'boAt Lifestyle Official Store',
  'Quick delivery with 7-day replacement',
  'https://www.myntra.com/headphones/boat/boat-airdopes-141-tws-earbuds/17849102/buy',
  '10% off with Myntra Kotak Card'
);

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-iphone-15',
    title: 'Apple iPhone 15 (128 GB) - Black',
    brand: 'Apple',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Dynamic Island brings notifications alive',
      '48MP Main camera with 2x Telephoto zoom',
      'A16 Bionic chip with 5-core GPU',
      'USB-C with Precision finding for Find My',
      'All-day battery life (up to 20 hrs video)',
    ],
    bestStore: 'flipkart',
    currentBestPrice: 63999,
    originalMrp: 79900,
    discountPercent: 20,
    overallLowestEver: 54999,
    overallLowestStore: 'flipkart',
    stores: {
      amazon: iphoneAmazon,
      flipkart: iphoneFlipkart,
    },
    dealScore: 92,
    verdict: 'STEAL_DEAL',
    verdictReason: 'Flipkart is beating Amazon by ₹1,000 right now. This is within 8% of the lowest ever Diwali Big Billion Days price (₹54,999).',
    isFakeDiscount: false,
    mrpInflationText: 'Official Apple MRP ₹79,900 verified across both retailers without artificial inflation.',
  },
  {
    id: 'prod-sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
    brand: 'Sony',
    category: 'Audio & Wearables',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Industry-leading dual processor V1 & QN1 ANC',
      '30-hour battery life with 3-minute quick charge',
      'Ultra-comfortable lightweight soft fit leather',
      'Multipoint connection to 2 devices simultaneously',
      'Crystal clear hands-free calling with 4 beamforming mics',
    ],
    bestStore: 'amazon',
    currentBestPrice: 26990,
    originalMrp: 34990,
    discountPercent: 23,
    overallLowestEver: 23990,
    overallLowestStore: 'amazon',
    stores: {
      amazon: sonyAmazon,
      flipkart: sonyFlipkart,
    },
    dealScore: 89,
    verdict: 'GOOD_DEAL',
    verdictReason: 'Amazon has an active ₹2,500 coupon making it ₹1,500 cheaper than Flipkart. Excellent time to buy before prices return to ₹29,990.',
    isFakeDiscount: false,
  },
  {
    id: 'prod-macbook-air-m2',
    title: 'Apple 2022 MacBook Air M2 Chip (13.6-inch, 8GB Unified RAM, 256GB SSD) - Space Grey',
    brand: 'Apple',
    category: 'Laptops & Computers',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Strikingly thin aluminum unibody design (1.24 kg)',
      'Apple M2 chip with 8-core CPU and 8-core GPU',
      'Up to 18 hours of battery life',
      '13.6-inch Liquid Retina display with 500 nits',
      '1080p FaceTime HD camera & 3-mic array',
    ],
    bestStore: 'amazon',
    currentBestPrice: 87990,
    originalMrp: 99900,
    discountPercent: 12,
    overallLowestEver: 79990,
    overallLowestStore: 'amazon',
    stores: {
      amazon: macbookAmazon,
      flipkart: macbookFlipkart,
    },
    dealScore: 78,
    verdict: 'FAIR_PRICE',
    verdictReason: 'Price is stable near its 3-month median. If you can wait for Prime Day or Freedom Festival, you could save an additional ₹7,000.',
    isFakeDiscount: false,
  },
  {
    id: 'prod-samsung-s24',
    title: 'Samsung Galaxy S24 5G AI Smartphone (Amber Yellow, 8GB, 128GB Storage)',
    brand: 'Samsung',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Galaxy AI suite with Live Translate & Circle to Search',
      '6.2-inch FHD+ Dynamic AMOLED 2X 120Hz display',
      'Armor Aluminum frame with IP68 water resistance',
      '50MP AI enhanced camera system',
      '7 years of guaranteed OS and security upgrades',
    ],
    bestStore: 'flipkart',
    currentBestPrice: 61999,
    originalMrp: 79999,
    discountPercent: 23,
    overallLowestEver: 56999,
    overallLowestStore: 'flipkart',
    stores: {
      amazon: samsungAmazon,
      flipkart: samsungFlipkart,
    },
    dealScore: 86,
    verdict: 'GOOD_DEAL',
    verdictReason: 'Flipkart offers ₹1,000 lower price plus ₹5,000 instant card discounts. Great value high-tier flagship.',
    isFakeDiscount: false,
  },
  {
    id: 'prod-nike-pegasus-40',
    title: 'Nike Men Air Zoom Pegasus 40 Road Running Shoes',
    brand: 'Nike',
    category: 'Fashion & Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Dual Nike Air Zoom units for high-energy response',
      'Engineered single-layer mesh for optimized breathability',
      'Redesigned midfoot strap for accommodating fit',
      'Waffle-inspired rubber outsole for traction',
    ],
    bestStore: 'myntra',
    currentBestPrice: 7471,
    originalMrp: 11495,
    discountPercent: 35,
    overallLowestEver: 6890,
    overallLowestStore: 'myntra',
    stores: {
      amazon: nikeAmazon,
      flipkart: nikeFlipkart,
      myntra: nikeMyntra,
    },
    dealScore: 94,
    verdict: 'STEAL_DEAL',
    verdictReason: 'Myntra is ₹1,024 cheaper than Amazon and ₹724 cheaper than Flipkart with the RUNNER10 coupon! Highest discount among all 3 stores.',
    isFakeDiscount: false,
  },
  {
    id: 'prod-levis-511-slim',
    title: "Levi's Men 511 Slim Fit Stretchable Denim Jeans",
    brand: "Levi's",
    category: 'Fashion & Footwear',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Slim fit cut that sits below the waist',
      'Premium stretch cotton for all-day comfort',
      'Signature 5-pocket styling and leather patch',
      'Zip fly with branded button closure',
    ],
    bestStore: 'myntra',
    currentBestPrice: 1679,
    originalMrp: 3999,
    discountPercent: 58,
    overallLowestEver: 1499,
    overallLowestStore: 'myntra',
    stores: {
      amazon: levisAmazon,
      flipkart: levisFlipkart,
      myntra: levisMyntra,
    },
    dealScore: 95,
    verdict: 'STEAL_DEAL',
    verdictReason: 'Huge 58% discount on Myntra with active STYLE15 coupon. Beating Flipkart by ₹220 and Amazon by ₹320.',
    isFakeDiscount: false,
  },
  {
    id: 'prod-dyson-v12',
    title: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum Cleaner',
    brand: 'Dyson',
    category: 'Home & Appliances',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Laser Fluffy reveals invisible micro-dust',
      'Piezo acoustic sensor measures dust particle count',
      'Powerful 150 AW Hyperdymium digital motor',
      'Up to 60 minutes fade-free run time with click-in battery',
      'Single-button power control with LCD screen',
    ],
    bestStore: 'amazon',
    currentBestPrice: 46900,
    originalMrp: 55900,
    discountPercent: 16,
    overallLowestEver: 41900,
    overallLowestStore: 'amazon',
    stores: {
      amazon: dysonAmazon,
      flipkart: dysonFlipkart,
    },
    dealScore: 82,
    verdict: 'GOOD_DEAL',
    verdictReason: 'Amazon has a direct ₹2,000 edge over Flipkart plus ₹4,000 bank discount. Solid deal for a premium appliance.',
    isFakeDiscount: false,
  },
  {
    id: 'prod-boat-airdopes-141',
    title: 'boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds (Bold Black)',
    brand: 'boAt',
    category: 'Audio & Wearables',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    specs: [
      'Up to 42 Hours total playback time with carry case',
      'ENx Environmental Noise Cancelling mic technology',
      'ASAP Charge: 5 mins gives 75 mins playtime',
      'BEAST mode with 80ms low latency for gaming',
      'IPX4 water and sweat resistance',
    ],
    bestStore: 'flipkart',
    currentBestPrice: 899,
    originalMrp: 4490,
    discountPercent: 80,
    overallLowestEver: 799,
    overallLowestStore: 'flipkart',
    stores: {
      amazon: boatAmazon,
      flipkart: boatFlipkart,
      myntra: boatMyntra,
    },
    dealScore: 91,
    verdict: 'STEAL_DEAL',
    verdictReason: 'Flipkart pricing of ₹899 is ₹100 lower than Amazon and ₹200 lower than Myntra. Outstanding entry TWS price point.',
    isFakeDiscount: true,
    mrpInflationText: 'Note: The MRP ₹4,490 is promotional standard. The real market price typically stays between ₹899 - ₹1,499.',
  },
];
