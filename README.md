# PriceLens India — Multi-Store Price History Tracker

> **Real-time price history tracker and drop radar for Amazon India, Flipkart, and Myntra.**

![Price History Tracker](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80)

## Features

- **Interactive Multi-Store Price Graphs**:
  - High-performance Chart.js timeline with smooth bezier curves and area fills.
  - **All-Stores Comparison Overlay**: Compare Amazon, Flipkart, and Myntra prices on the exact same timeline side-by-side.
  - **Time Range Selectors**: Inspect 1 Month (1M), 3 Months (3M), 6 Months (6M), and 1 Year (1Y) price trends.
  - **Indian Festive Sale Radar**: Flags key sale drops like The Big Billion Days, Amazon Great Indian Festival, Myntra End of Reason Sale (EORS), Republic Day Sale, and Prime Day.
  - **Export Tools**: 1-click Download Chart as PNG image or Export Price History as CSV.

- **AI Deal Verdict & Fake Discount Detector**:
  - Calculates real historical discount vs artificial pre-sale price hikes.
  - 0–100 Deal Score with actionable verdicts: *Steal Deal*, *Good Deal*, *Fair Regular Price*, or *Overpriced / Wait*.
  - Calculates gap to all-time lowest price.

- **Direct Store Comparison Matrix**:
  - Side-by-side cards for Amazon, Flipkart, and Myntra.
  - Highlights lowest price winner with trophy badge.
  - Lists retailer-specific bank offers (HDFC, ICICI, Axis, SBI) and active coupons.

- **Universal Search & URL Parser**:
  - Paste any link from Amazon (`amazon.in`), Flipkart (`flipkart.com`), or Myntra (`myntra.com`).
  - Auto-detects store domain and analyzes product identifier (ASIN, FSN, Item ID).
  - Search by keywords or click 1-click quick try demo links (iPhone 15, Sony WH-1000XM5, MacBook Air M2, Nike Pegasus 40, Levi's 511 Jeans, boAt Airdopes).

- **Price Drop Alert Simulator**:
  - Interactive target price slider.
  - Store preference selector (Any store, Amazon only, Flipkart only, Myntra only).
  - Confetti celebration upon alert confirmation.

- **Local Watchlist**:
  - Bookmark products with local storage persistence.
  - Live price change indicators (price drop vs price increase since added).

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (dark mode optimized)
- **Visualizations**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Effects**: canvas-confetti

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
