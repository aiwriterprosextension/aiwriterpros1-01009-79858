/**
 * Amazon Product Scraper Utilities
 * Handles Amazon URL parsing, ASIN extraction, affiliate link generation,
 * locale mapping, and image optimization
 */

// --- Interfaces ---

export interface AmazonLocale {
  domain: string;
  country: string;
  url: string;
  node: string;
  alt_nodes: string[];
  category_name: string;
  category_name_native: string;
}

export interface CustomerQuestion {
  question: string;
  answer: string;
  asked_by_date?: string;
}

export interface ReviewData {
  stars: string;
  title: string;
  text: string;
}

export interface ProductDetail {
  title: string;
  attributes: Array<{ name: string; value: string }>;
}

export interface AmazonProductData {
  productURL: string;
  productASIN: string;
  amazonSite: string;
  productCategoryBreadcrumbs: string[];
  productTitle: string;
  productImages: string[];
  productImageData?: (string | null)[];
  price: string;
  colors: string[];
  styles: string[];
  sizes: string[];
  attributes: Record<string, string>;
  details: ProductDetail[];
  aboutThisItem: string[];
  customerQuestions: CustomerQuestion[];
  localReviewsData: ReviewData[];
  globalReviewsData: ReviewData[];
  averageRating: number;
  totalVotes: number;
}

// --- Amazon Locales ---

export function allAmazonLocales(): AmazonLocale[] {
  return [
    { domain: "amazon.com", country: "United States", url: "https://www.amazon.com/gp/movers-and-shakers/", node: "172282", alt_nodes: [], category_name: "Electronics", category_name_native: "Electronics" },
    { domain: "amazon.ca", country: "Canada", url: "https://www.amazon.ca/gp/movers-and-shakers/", node: "667823011", alt_nodes: [], category_name: "Electronics", category_name_native: "Electronics" },
    { domain: "amazon.com.mx", country: "Mexico", url: "https://www.amazon.com.mx/gp/movers-and-shakers", node: "9482558011", alt_nodes: [], category_name: "Electronics", category_name_native: "Electrónicos" },
    { domain: "amazon.co.uk", country: "United Kingdom", url: "https://www.amazon.co.uk/gp/movers-and-shakers", node: "560798", alt_nodes: [], category_name: "Electronics", category_name_native: "Electronics" },
    { domain: "amazon.de", country: "Germany", url: "https://www.amazon.de/gp/movers-and-shakers", node: "562066", alt_nodes: [], category_name: "Electronics", category_name_native: "Elektronik-Foto" },
    { domain: "amazon.fr", country: "France", url: "https://www.amazon.fr/gp/movers-and-shakers", node: "13921051", alt_nodes: [], category_name: "Electronics", category_name_native: "High-Tech" },
    { domain: "amazon.es", country: "Spain", url: "https://www.amazon.es/gp/movers-and-shakers", node: "599370031", alt_nodes: [], category_name: "Electronics", category_name_native: "Electrónica" },
    { domain: "amazon.it", country: "Italy", url: "https://www.amazon.it/gp/movers-and-shakers", node: "412609031", alt_nodes: [], category_name: "Electronics", category_name_native: "Elettronica" },
    { domain: "amazon.in", country: "India", url: "https://www.amazon.in/gp/movers-and-shakers", node: "976419031", alt_nodes: [], category_name: "Electronics", category_name_native: "Electronics" },
    { domain: "amazon.nl", country: "Netherlands", url: "https://www.amazon.nl/gp/movers-and-shakers", node: "16269066031", alt_nodes: [], category_name: "Electronics", category_name_native: "Elektronica" },
    { domain: "amazon.se", country: "Sweden", url: "https://www.amazon.se/gp/movers-and-shakers", node: "20512681031", alt_nodes: [], category_name: "Electronics", category_name_native: "Elektronik" },
    { domain: "amazon.pl", country: "Poland", url: "https://www.amazon.pl/gp/movers-and-shakers", node: "20657432031", alt_nodes: [], category_name: "Electronics", category_name_native: "Elektronika" },
    { domain: "amazon.com.br", country: "Brazil", url: "https://www.amazon.com.br/gp/movers-and-shakers", node: "16209062011", alt_nodes: [], category_name: "Electronics", category_name_native: "Eletrônicos e Tecnologia" },
    { domain: "amazon.com.au", country: "Australia", url: "https://www.amazon.com.au/gp/movers-and-shakers", node: "4851799051", alt_nodes: [], category_name: "Electronics", category_name_native: "Electronics" },
    { domain: "amazon.co.jp", country: "Japan", url: "https://www.amazon.co.jp/gp/movers-and-shakers", node: "3210981", alt_nodes: [], category_name: "Electronics", category_name_native: "家電＆カメラ" },
    { domain: "amazon.sg", country: "Singapore", url: "https://www.amazon.sg/gp/movers-and-shakers", node: "6314449051", alt_nodes: [], category_name: "Electronics", category_name_native: "Electronics" },
    { domain: "amazon.ae", country: "United Arab Emirates", url: "https://www.amazon.ae/gp/movers-and-shakers", node: "11601327031", alt_nodes: [], category_name: "Electronics", category_name_native: "Electronics" },
  ];
}

/**
 * Get all Amazon domain strings
 */
export function amazonDomains(): string[] {
  return allAmazonLocales().map((locale) => locale.domain);
}

// --- Image Optimization ---

/**
 * Converts Amazon thumbnail URL to high-res (1500px) version
 * Uses the same regex pattern from the Chrome extension
 */
export function upgradeToHighResImage(thumbnailUrl: string): string {
  return thumbnailUrl.replace(/._[^.]+_\.(jpeg|jpg|gif|png|webp|bmp|svg)/, '._SL1500_.$1');
}

/**
 * Generate an SEO-optimized filename for a product image
 */
export function generateImageSEOFilename(
  productName: string,
  index: number,
  imageType: 'featured' | 'body' = 'body'
): string {
  const cleanName = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  const suffix = imageType === 'featured' ? 'featured' : `detail-${index + 1}`;
  return `${cleanName}-${suffix}.webp`;
}

/**
 * Generate SEO alt text for a product image
 */
export function generateImageAltText(
  productName: string,
  index: number,
  imageType: 'featured' | 'body' = 'body'
): string {
  if (imageType === 'featured') {
    return `${productName} - comprehensive product review and buying guide`;
  }

  const variations = [
    `${productName} product design and build quality`,
    `${productName} in use - practical demonstration`,
    `Close-up of ${productName} key features`,
    `${productName} size comparison for reference`,
  ];

  return variations[index % variations.length];
}

// --- ASIN Extraction ---

/**
 * Extract ASIN from Amazon product URL
 */
export function extractASINFromURL(url: string): string | null {
  try {
    if (!url || typeof url !== 'string') return null;

    const cleanUrl = url.trim();

    const dpMatch = cleanUrl.match(/\/dp\/([A-Z0-9]{10})/i);
    if (dpMatch?.[1]) return dpMatch[1].toUpperCase();

    const gpMatch = cleanUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (gpMatch?.[1]) return gpMatch[1].toUpperCase();

    const asinParam = new URL(cleanUrl).searchParams.get('ASIN');
    if (asinParam && /^[A-Z0-9]{10}$/i.test(asinParam)) return asinParam.toUpperCase();

    return null;
  } catch {
    return null;
  }
}

// --- URL Validation ---

/**
 * Validate if a URL is a valid Amazon product URL
 */
export function isValidAmazonURL(url: string): boolean {
  try {
    if (!url || typeof url !== 'string') return false;

    const urlObj = new URL(url.trim());
    const hostname = urlObj.hostname.toLowerCase();
    const domains = amazonDomains();

    const isAmazonDomain = domains.some(
      (domain) => hostname === domain || hostname === `www.${domain}`
    );

    if (!isAmazonDomain) return false;

    return extractASINFromURL(url) !== null;
  } catch {
    return false;
  }
}

/**
 * Check if a URL is an Amazon product page (has /dp/ or /gp/product/)
 */
export function isAmazonProductPage(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    return pathSegments.includes('dp') || (pathSegments.includes('gp') && pathSegments.includes('product'));
  } catch {
    return false;
  }
}

// --- Domain Extraction ---

/**
 * Extract Amazon domain from URL
 */
export function extractAmazonDomain(url: string): string {
  try {
    const urlObj = new URL(url.trim());
    const hostname = urlObj.hostname.toLowerCase().replace('www.', '');
    const domains = amazonDomains();

    if (domains.includes(hostname)) return hostname;
    return 'amazon.com';
  } catch {
    return 'amazon.com';
  }
}

/**
 * Get locale info for an Amazon domain
 */
export function getLocaleForDomain(domain: string): AmazonLocale | undefined {
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
  return allAmazonLocales().find((locale) => cleanDomain.endsWith(locale.domain));
}

// --- Affiliate Links ---

/**
 * Format Amazon affiliate URL with associate ID
 */
export function formatAmazonAffiliateURL(
  asin: string,
  associateId: string,
  domain: string = 'amazon.com'
): string {
  if (!asin || !associateId) throw new Error('ASIN and Associate ID are required');
  if (!/^[A-Z0-9]{10}$/i.test(asin)) throw new Error('Invalid ASIN format');

  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
  const domains = amazonDomains();
  if (!domains.includes(cleanDomain)) throw new Error(`Invalid Amazon domain: ${cleanDomain}`);

  return `https://www.${cleanDomain}/dp/${asin.toUpperCase()}?tag=${encodeURIComponent(associateId)}`;
}

/**
 * Convert product URL to affiliate link
 */
export function convertToAffiliateLink(productUrl: string, associateId: string): string {
  try {
    if (!isValidAmazonURL(productUrl)) return productUrl;

    const asin = extractASINFromURL(productUrl);
    if (!asin) return productUrl;

    const domain = extractAmazonDomain(productUrl);
    return formatAmazonAffiliateURL(asin, associateId, domain);
  } catch {
    return productUrl;
  }
}
