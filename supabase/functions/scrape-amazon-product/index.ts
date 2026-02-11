import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AMAZON_DOMAINS = [
  'amazon.com', 'amazon.ca', 'amazon.com.mx', 'amazon.co.uk', 'amazon.de',
  'amazon.fr', 'amazon.es', 'amazon.it', 'amazon.in', 'amazon.nl',
  'amazon.se', 'amazon.pl', 'amazon.com.br', 'amazon.com.au',
  'amazon.co.jp', 'amazon.sg', 'amazon.ae',
];

interface AmazonProductData {
  productURL: string;
  productASIN: string;
  amazonSite: string;
  productTitle: string;
  price: string;
  productImages: string[];
  productCategoryBreadcrumbs: string[];
  attributes: Record<string, string>;
  aboutThisItem: string[];
  averageRating: number;
  totalVotes: number;
  colors: string[];
  styles: string[];
  sizes: string[];
  details: Array<{ title: string; attributes: Array<{ name: string; value: string }> }>;
  customerQuestions: Array<{ question: string; answer: string }>;
  localReviewsData: Array<{ stars: string; title: string; text: string }>;
  globalReviewsData: Array<{ stars: string; title: string; text: string }>;
}

function extractASINFromURL(url: string): string | null {
  try {
    const cleanUrl = url.trim();
    const dpMatch = cleanUrl.match(/\/dp\/([A-Z0-9]{10})/i);
    if (dpMatch?.[1]) return dpMatch[1].toUpperCase();
    const gpMatch = cleanUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (gpMatch?.[1]) return gpMatch[1].toUpperCase();
    const asinParam = new URL(cleanUrl).searchParams.get('ASIN');
    if (asinParam && /^[A-Z0-9]{10}$/i.test(asinParam)) return asinParam.toUpperCase();
    return null;
  } catch { return null; }
}

function extractAmazonDomain(url: string): string | null {
  try {
    const hostname = new URL(url.trim()).hostname.toLowerCase().replace('www.', '');
    return AMAZON_DOMAINS.includes(hostname) ? hostname : null;
  } catch { return null; }
}

function isValidAmazonURL(url: string): boolean {
  try {
    const hostname = new URL(url.trim()).hostname.toLowerCase();
    const isAmazon = AMAZON_DOMAINS.some(d => hostname === d || hostname === `www.${d}`);
    return isAmazon && extractASINFromURL(url) !== null;
  } catch { return false; }
}

function upgradeToHighResImage(thumbnailUrl: string): string {
  return thumbnailUrl.replace(/._[^.]+_\.(jpeg|jpg|gif|png|webp|bmp|svg)/, '._SL1500_.$1');
}

// --- HTML Parsing Helpers ---

function extractTextBySelector(html: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/<[^>]*>/g, '').trim();
  }
  return '';
}

function extractProductTitle(html: string): string {
  return extractTextBySelector(html, [
    /<span[^>]*id="productTitle"[^>]*>([\s\S]*?)<\/span>/i,
    /<h1[^>]*class="[^"]*a-size-large[^"]*"[^>]*>([\s\S]*?)<\/h1>/i,
    /<title>([\s\S]*?)<\/title>/i,
  ]);
}

function extractPrice(html: string): string {
  const price = extractTextBySelector(html, [
    /<span[^>]*class="a-offscreen"[^>]*>([\s\S]*?)<\/span>/i,
    /<span[^>]*id="priceblock_ourprice"[^>]*>([\s\S]*?)<\/span>/i,
    /<span[^>]*class="[^"]*a-price-whole[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
  ]);
  return price || 'Price not available';
}

function extractImages(html: string): string[] {
  const images: string[] = [];
  // Try to find image URLs from data attributes and img tags
  const imgPattern = /https:\/\/m\.media-amazon\.com\/images\/[^"'\s)]+\.(jpg|jpeg|png|webp|gif)/gi;
  const matches = html.match(imgPattern) || [];

  const seen = new Set<string>();
  for (const imgUrl of matches) {
    const highRes = upgradeToHighResImage(imgUrl);
    if (!seen.has(highRes) && !imgUrl.includes('transparent-pixel') && !imgUrl.includes('sprite')) {
      seen.add(highRes);
      images.push(highRes);
      if (images.length >= 6) break;
    }
  }
  return images;
}

function extractBulletPoints(html: string): string[] {
  const bullets: string[] = [];
  const bulletSection = html.match(/<div[^>]*id="feature-bullets"[^>]*>([\s\S]*?)<\/div>/i);
  if (bulletSection) {
    const listItems = bulletSection[1].match(/<span[^>]*class="[^"]*a-list-item[^"]*"[^>]*>([\s\S]*?)<\/span>/gi) || [];
    for (const item of listItems) {
      const text = item.replace(/<[^>]*>/g, '').trim();
      if (text && text.length > 5) bullets.push(text);
    }
  }
  return bullets;
}

function extractRating(html: string): { averageRating: number; totalVotes: number } {
  let averageRating = 0;
  let totalVotes = 0;

  const ratingMatch = html.match(/(\d+\.?\d*)\s*out\s*of\s*5/i);
  if (ratingMatch) averageRating = parseFloat(ratingMatch[1]);

  const votesMatch = html.match(/([\d,]+)\s*(global\s+)?ratings/i);
  if (votesMatch) totalVotes = parseInt(votesMatch[1].replace(/,/g, ''), 10);

  return { averageRating, totalVotes };
}

function extractFromMarkdown(markdown: string): {
  title: string;
  bulletPoints: string[];
  rating: { averageRating: number; totalVotes: number };
} {
  let title = '';
  const bulletPoints: string[] = [];
  let averageRating = 0;
  let totalVotes = 0;

  // Extract title from first heading
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  if (titleMatch) title = titleMatch[1].trim();

  // Extract bullet points (lines starting with - or *)
  const bulletMatches = markdown.match(/^[\-\*]\s+(.+)$/gm) || [];
  for (const bullet of bulletMatches) {
    const text = bullet.replace(/^[\-\*]\s+/, '').trim();
    if (text.length > 10) bulletPoints.push(text);
  }

  // Extract rating
  const ratingMatch = markdown.match(/(\d+\.?\d*)\s*out\s*of\s*5/i);
  if (ratingMatch) averageRating = parseFloat(ratingMatch[1]);

  const votesMatch = markdown.match(/([\d,]+)\s*(global\s+)?ratings/i);
  if (votesMatch) totalVotes = parseInt(votesMatch[1].replace(/,/g, ''), 10);

  return { title, bulletPoints, rating: { averageRating, totalVotes } };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productUrl, productName } = await req.json();

    if (!productUrl) {
      return new Response(
        JSON.stringify({ error: 'Product URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidAmazonURL(productUrl)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Amazon URL. Please provide a valid Amazon product URL.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const asin = extractASINFromURL(productUrl);
    const domain = extractAmazonDomain(productUrl);

    if (!asin || !domain) {
      return new Response(
        JSON.stringify({ error: 'Could not extract product ASIN from URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing Amazon product: ASIN=${asin}, Domain=${domain}`);

    // --- Try Firecrawl scraping ---
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    let scrapedData: AmazonProductData | null = null;

    if (firecrawlApiKey) {
      try {
        console.log('Attempting Firecrawl scrape...');
        const cleanUrl = `https://www.${domain}/dp/${asin}`;

        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: cleanUrl,
            formats: ['markdown', 'html'],
            onlyMainContent: false,
            waitFor: 3000,
          }),
        });

        if (response.ok) {
          const firecrawlResult = await response.json();
          const html = firecrawlResult?.data?.html || firecrawlResult?.html || '';
          const markdown = firecrawlResult?.data?.markdown || firecrawlResult?.markdown || '';

          console.log(`Firecrawl returned HTML: ${html.length} chars, Markdown: ${markdown.length} chars`);

          // Parse HTML for structured data
          const title = extractProductTitle(html) || productName || `Product ${asin}`;
          const price = extractPrice(html);
          const images = extractImages(html);
          const bulletPoints = extractBulletPoints(html);
          const { averageRating, totalVotes } = extractRating(html);

          // Also parse markdown for additional data
          const mdData = extractFromMarkdown(markdown);

          scrapedData = {
            productURL: cleanUrl,
            productASIN: asin,
            amazonSite: domain,
            productTitle: title || mdData.title || productName || `Product ${asin}`,
            price,
            productImages: images,
            productCategoryBreadcrumbs: [],
            attributes: {},
            aboutThisItem: bulletPoints.length > 0 ? bulletPoints : mdData.bulletPoints,
            averageRating: averageRating || mdData.rating.averageRating,
            totalVotes: totalVotes || mdData.rating.totalVotes,
            colors: [],
            styles: [],
            sizes: [],
            details: [],
            customerQuestions: [],
            localReviewsData: [],
            globalReviewsData: [],
          };

          console.log(`Scraped product: "${scrapedData.productTitle}", ${images.length} images, ${bulletPoints.length} bullets`);
        } else {
          const errorText = await response.text();
          console.error('Firecrawl scrape failed:', response.status, errorText);
        }
      } catch (firecrawlError) {
        console.error('Firecrawl error:', firecrawlError);
      }
    } else {
      console.log('FIRECRAWL_API_KEY not set, returning metadata only');
    }

    // Fallback to metadata-only response
    const finalData: AmazonProductData = scrapedData || {
      productURL: productUrl,
      productASIN: asin,
      amazonSite: domain,
      productTitle: productName || `Product ${asin}`,
      price: '$0.00',
      productImages: [],
      productCategoryBreadcrumbs: [],
      attributes: {},
      aboutThisItem: [],
      averageRating: 0,
      totalVotes: 0,
      colors: [],
      styles: [],
      sizes: [],
      details: [],
      customerQuestions: [],
      localReviewsData: [],
      globalReviewsData: [],
    };

    return new Response(
      JSON.stringify({
        ...finalData,
        _scraped: !!scrapedData,
        _source: scrapedData ? 'firecrawl' : 'metadata-only',
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-amazon-product:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
