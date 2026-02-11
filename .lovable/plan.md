

# Plan: Enhance Amazon Product Scraping & Image System

## Overview
Adapt valuable parts from the Chrome extension code to improve your Amazon product data handling and integrate Firecrawl for actual scraping capabilities.

---

## Phase 1: Enhance Amazon Utilities with Chrome Extension Logic

### File: `src/utils/amazonScraper.ts`

**Add:**
1. **Full Amazon Locales Mapping** - Import the complete `allAmazonLocales()` structure with:
   - Domain
   - Country name
   - Category nodes
   - Native category names

2. **Image URL Optimizer Function**:
   ```typescript
   export function upgradeToHighResImage(thumbnailUrl: string): string {
     // Converts Amazon thumbnail to high-res (1500px)
     return thumbnailUrl.replace(/._[^.]+_\.(jpeg|jpg|gif|png|webp|bmp|svg)/, '._SL1500_.$1');
   }
   ```

3. **Enhanced Data Interface** - Update `AmazonProductData` to include:
   - `customerQuestions` (Q&A array)
   - `localReviewsData` and `globalReviewsData`
   - `details` (structured product details tables)
   - `sizes` array
   - `productImageData` (base64 for downloaded images)

---

## Phase 2: Integrate Firecrawl for Real Amazon Scraping

### Create: `supabase/functions/firecrawl-scrape/index.ts`

A new edge function that uses Firecrawl's scrape API to fetch Amazon product pages and extract data.

### Update: `supabase/functions/scrape-amazon-product/index.ts`

**Replace placeholder data with:**
1. Call Firecrawl to scrape the Amazon URL
2. Parse the returned HTML/markdown for:
   - Product title (using regex patterns from extension)
   - Price (multiple selector fallbacks)
   - Images (with high-res upgrade)
   - Features and attributes
   - Reviews and ratings
3. Return structured `AmazonProductData`

---

## Phase 3: Enhance Image Generation with Product Context

### Update: `supabase/functions/generate-article-images/index.ts`

**Improvements:**
1. Accept scraped Amazon product data as input
2. Use actual product features in image prompts
3. Generate images that match the real product aesthetics
4. Include option to reference Amazon product images for style matching

### Add: `supabase/functions/download-amazon-images/index.ts`

A new function to:
1. Fetch Amazon product images
2. Convert thumbnails to high-res using the optimization pattern
3. Store in Supabase storage
4. Return URLs for use in articles

---

## Phase 4: Create Product Data Hook

### Create: `src/hooks/useAmazonProductData.ts`

A React hook that:
1. Takes an Amazon URL as input
2. Validates the URL using enhanced validation
3. Calls the scrape-amazon-product function
4. Returns structured product data for article generation
5. Provides loading/error states
6. Caches results to avoid duplicate scrapes

---

## Phase 5: Update Article Generators to Use Real Data

### Update all 5 article generation functions:

**Pass actual product data:**
- Real product title and price
- Actual features and specifications
- Real customer reviews for authenticity
- Customer Q&A for FAQ sections
- Accurate ratings and vote counts

**Image integration:**
- Option to use scraped Amazon images (with affiliate disclosure)
- Option to generate AI images based on product specs
- Hybrid approach: use Amazon images + AI lifestyle shots

---

## Phase 6: Add Firecrawl Connector

### Setup:
1. Use the Firecrawl connector to get API access
2. Create edge function for scraping
3. Handle rate limits and errors gracefully

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/utils/amazonScraper.ts` | Update | Add locales, image optimizer, enhanced interface |
| `supabase/functions/firecrawl-scrape/index.ts` | Create | Firecrawl integration |
| `supabase/functions/scrape-amazon-product/index.ts` | Update | Use Firecrawl for real data |
| `supabase/functions/download-amazon-images/index.ts` | Create | Fetch/optimize Amazon images |
| `supabase/functions/generate-article-images/index.ts` | Update | Use real product data in prompts |
| `src/hooks/useAmazonProductData.ts` | Create | React hook for product data |
| `src/lib/api/firecrawl.ts` | Create | Firecrawl API wrapper |

---

## Expected Outcomes

1. **Real product data** in generated articles (not placeholders)
2. **High-quality Amazon images** properly optimized
3. **AI-generated images** that match actual product specs
4. **Customer reviews and Q&A** integrated into articles
5. **Multi-locale support** for international Amazon sites
6. **Better SEO** with accurate product information

---

## Prerequisites

Before implementing, you'll need to:
1. **Connect Firecrawl** - Use the connector to enable scraping
2. Alternatively, provide a RapidAPI key for Amazon Product API

