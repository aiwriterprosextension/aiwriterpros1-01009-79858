import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildProductDataSection(productData: any): string {
  if (!productData) return '';
  
  let section = `\n═══════════════════════════════════════════════════════════
REAL PRODUCT DATA (Use this actual data in the article)
═══════════════════════════════════════════════════════════\n`;

  if (productData.title) section += `\nProduct Title: ${productData.title}`;
  if (productData.price) section += `\nPrice: ${productData.price}`;
  if (productData.rating) section += `\nAverage Rating: ${productData.rating}/5`;
  if (productData.totalReviews) section += `\nTotal Reviews: ${productData.totalReviews}`;
  if (productData.asin) section += `\nASIN: ${productData.asin}`;
  
  if (productData.categories?.length) {
    section += `\nCategory: ${productData.categories.join(' > ')}`;
  }
  if (productData.colors?.length) {
    section += `\nAvailable Colors: ${productData.colors.join(', ')}`;
  }
  if (productData.sizes?.length) {
    section += `\nAvailable Sizes: ${productData.sizes.join(', ')}`;
  }

  if (productData.features?.length) {
    section += `\n\nKey Features (About This Item):`;
    productData.features.forEach((f: string, i: number) => {
      section += `\n${i + 1}. ${f}`;
    });
  }

  if (productData.attributes && Object.keys(productData.attributes).length) {
    section += `\n\nProduct Attributes:`;
    for (const [key, value] of Object.entries(productData.attributes)) {
      section += `\n- ${key}: ${value}`;
    }
  }

  if (productData.details?.length) {
    productData.details.forEach((detail: any) => {
      section += `\n\n${detail.title}:`;
      detail.attributes?.forEach((attr: any) => {
        section += `\n- ${attr.name}: ${attr.value}`;
      });
    });
  }

  if (productData.reviews?.length) {
    section += `\n\nCustomer Reviews (Use these for authenticity):`;
    productData.reviews.forEach((r: any, i: number) => {
      section += `\n\n[Review ${i + 1}] ⭐${r.stars}/5 - "${r.title}"`;
      section += `\n${r.text?.substring(0, 300)}`;
    });
  }

  if (productData.customerQuestions?.length) {
    section += `\n\nCustomer Q&A (Include in FAQ section):`;
    productData.customerQuestions.forEach((q: any) => {
      section += `\nQ: ${q.question}`;
      section += `\nA: ${q.answer}`;
    });
  }

  section += `\n\nIMPORTANT: Use the REAL data above to make the article authentic and accurate. Include actual prices, ratings, features, and customer quotes.\n`;
  
  return section;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productUrl, configuration } = await req.json();
    console.log('Generating review for:', productUrl);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const targetWordCount = configuration.wordCount || 1500;
    const competitorShortest = configuration.competitorData?.shortestCompetitor || 1500;
    const densityTarget = Math.min(targetWordCount, competitorShortest, 2000);

    const productDataSection = buildProductDataSection(configuration.productData);
    const hasRealData = !!configuration.productData;

    console.log(`Generating density-first Amazon review, target: ~${densityTarget} words, hasRealData: ${hasRealData}`);

    const systemPrompt = `You are an elite Amazon affiliate SEO specialist. Your mission: Create the SHORTEST possible product review that contains 100% of required SEO signals to outrank long-form competitors.

═══════════════════════════════════════════════════════════
🎯 DENSITY-FIRST CONTENT STRATEGY 🎯
TARGET: ~${densityTarget} WORDS (NOT more — every sentence must earn its place)
RULE: Highest information value per sentence. Zero fluff.
═══════════════════════════════════════════════════════════

CORE PRINCIPLES:
- Data-rich HTML tables beat 5,000-word essays for Google rankings
- Bulleted lists with specific data points over paragraphs of prose
- Featured Snippet Bait: 40-word direct-answer paragraphs
- Every section must contain a table, list, or data point
- Keep ALL Schema.org (JSON-LD) and E-E-A-T signals — short content needs MORE technical proof

${hasRealData ? 'You have REAL scraped Amazon product data. Use ACTUAL specs, prices, ratings, and customer quotes. Do NOT fabricate data.' : ''}

WRITING STANDARDS:
- ${configuration.tone || 'Balanced'} tone, ${configuration.readingLevel || '8th Grade'} reading level
- Active voice, zero filler words
- Specific numbers and data in every section
- Honest pros AND cons`;

    const userPrompt = `Create a HIGH-DENSITY, SEO-optimized Amazon product review.

PRODUCT URL: ${productUrl}
${productDataSection}
CONFIGURATION:
- Target: ~${densityTarget} words (lean & mean — NOT a word more than needed)
- Primary keyword: ${configuration.primaryKeyword || 'product review'}
- Secondary keywords: ${configuration.secondaryKeywords || 'N/A'}
- Meta description: ${configuration.metaDescription || 'Auto-generate'}
- Schema: ${configuration.schemaType || 'Product + Review'}
- FAQ: ${configuration.faqCount || 8} questions
- CTAs: ${configuration.ctaCount || 3}
- Affiliate ID: ${configuration.amazonAffiliateId || 'N/A'}

DENSITY-FIRST STRUCTURE:

## 1. Quick Verdict (EXACTLY 40 words)
A single paragraph that directly answers "Is [product] worth buying?" — this is Featured Snippet bait for Position 0.

## 2. At-a-Glance Rating Table
| Criteria | Rating |
|----------|--------|
Use 8-10 rows. Include Overall, Value, Build, Features, etc.

## 3. Key Specs Table (10-12 rows)
${hasRealData ? 'Use REAL attributes and specs from the scraped data.' : ''}
Pure data table — no prose needed.

## 4. Who Should Buy This (bulleted list, 60-80 words)
✅ Perfect for: 3-4 bullet points
❌ Skip if: 2-3 bullet points

## 5. Features Analysis (300-400 words)
${hasRealData ? 'Use REAL "About This Item" features. Analyze each in 2-3 sentences max.' : ''}
For each feature: What it does → Why it matters → Real-world impact. Use sub-tables where possible.

## 6. Pros & Cons Table
| Pros | Cons |
Two-column table, 5-6 rows each. Specific, data-backed.

## 7. Comparison Table vs Top 2 Alternatives
| Feature | This Product | Alt 1 | Alt 2 |
8-10 comparison rows with specific values.

## 8. Price & Value (50-80 words)
${hasRealData && configuration.productData?.price ? `Real price: ${configuration.productData.price}` : ''}
Cost-per-use calculation or value comparison. Data, not prose.

## 9. Real Customer Insights (100-150 words)
${hasRealData ? 'Quote 3-4 REAL customer reviews. Use actual star ratings and quotes.' : ''}
Summarize sentiment patterns in a mini-table.

## 10. FAQ (${configuration.faqCount || 8} questions)
${hasRealData && configuration.productData?.customerQuestions?.length ? 'Use real customer Q&A.' : ''}
Each answer: 1-2 sentences max. Direct and factual.

## 11. Final Verdict (40-60 words)
Restate the quick verdict with a clear CTA.

CRITICAL: Include "Affiliate Disclosure" notice and "Verified Purchase" badge references. Maintain E-E-A-T signals throughout.
CRITICAL: Use markdown tables extensively. Return ONLY the complete markdown article.`;

    console.log('Calling Lovable AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Article generated successfully');

    let schemaMarkup = null;
    if (configuration.includeSchema) {
      schemaMarkup = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "name": configuration.productData?.title || "[Product Name]",
            "description": configuration.metaDescription || "[Product Description]",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": String(configuration.productData?.rating || "4.6"),
              "reviewCount": String(configuration.productData?.totalReviews || "8247")
            }
          },
          {
            "@type": "Review",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "author": { "@type": "Person", "name": "AIWriterPros" }
          }
        ]
      };
    }

    return new Response(JSON.stringify({ 
      content: generatedContent,
      schema: schemaMarkup,
      wordCount: generatedContent.split(/\s+/).length,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-amazon-review function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to generate review' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
