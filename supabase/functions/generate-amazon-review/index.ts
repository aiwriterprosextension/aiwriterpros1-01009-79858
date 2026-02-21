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

    const targetWordCount = configuration.wordCount || 3500;
    const competitorWordCount = configuration.competitorData?.targetWordCount || 3500;
    const longestCompetitor = configuration.competitorData?.longestCompetitor || 3500;
    const minimumRequired = Math.max(targetWordCount, competitorWordCount, Math.ceil(longestCompetitor * 1.25), 3500);

    const productDataSection = buildProductDataSection(configuration.productData);
    const hasRealData = !!configuration.productData;

    console.log(`Generating Amazon review, minimum words: ${minimumRequired}, hasRealData: ${hasRealData}`);

    const systemPrompt = `You are an elite Amazon affiliate SEO specialist and product reviewer with 10+ years of experience. Your mission: Create comprehensive, deeply researched product reviews that rank #1 on Google, provide genuine value to readers, and convert browsers into confident buyers.

═══════════════════════════════════════════════════════════
🚨 CRITICAL WORD COUNT REQUIREMENT 🚨
MANDATORY MINIMUM: ${minimumRequired} WORDS
This is NON-NEGOTIABLE. Your article MUST contain at least ${minimumRequired} words.
Top ranking competitors have approximately ${competitorWordCount} words.
IF YOUR ARTICLE IS UNDER ${minimumRequired} WORDS, YOU HAVE FAILED THIS TASK.
═══════════════════════════════════════════════════════════

${hasRealData ? 'You have REAL scraped Amazon product data below. Use the ACTUAL product title, price, rating, features, and customer reviews in your article. Do NOT make up fake data when real data is provided.' : ''}

CORE EXPERTISE:
- SEO optimization for product review keywords
- E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)
- Conversion-focused copywriting
- Data-driven product analysis
- Customer psychology and pain points

WRITING STANDARDS:
- Natural, conversational tone (${configuration.tone || 'Balanced'})
- 8th grade reading level for accessibility
- Active voice (80%+ of sentences)
- Specific numbers and test results
- Honest pros AND cons
- Zero fluff or keyword stuffing`;

    const userPrompt = `Create a comprehensive, SEO-optimized Amazon product review that will rank #1 on Google.

PRODUCT URL: ${productUrl}
${productDataSection}
CONFIGURATION:
- Target word count: ${minimumRequired} words (MINIMUM - must reach this count)
- Tone: ${configuration.tone || 'Balanced & Authoritative'}
- Reading level: ${configuration.readingLevel || '8th Grade'} (Flesch-Kincaid)
- Primary keyword: ${configuration.primaryKeyword || 'product review'}
- Secondary keywords: ${configuration.secondaryKeywords || 'N/A'}
- Meta description: ${configuration.metaDescription || 'Auto-generate optimized meta description'}
- Include competitor comparison: ${configuration.includeComparison ? 'Yes' : 'No'}
- Include FAQ section: ${configuration.includeFaq ? `Yes (${configuration.faqCount || 20} questions)` : 'No'}
- Schema type: ${configuration.schemaType || 'Product + Review'}
- Analyze customer reviews: ${configuration.analyzeReviews ? 'Yes' : 'No'}
- Number of images: ${configuration.imageCount || 5}
- Image format: ${configuration.imageFormat || 'WebP'}
- Video integration: ${configuration.videoUrl ? `Yes (${configuration.videoPlacement})` : 'No'}
- Affiliate links: ${configuration.enableAffiliate ? `Yes (${configuration.ctaCount} CTAs, ${configuration.ctaStyle} style, ID: ${configuration.amazonAffiliateId})` : 'No'}

MANDATORY ARTICLE STRUCTURE:
Follow this exact structure with specified word counts for each section.

═══════════════════════════════════════════════════════════════════
SECTION 1: QUICK NAVIGATION & RATING BOX (100-150 words)
═══════════════════════════════════════════════════════════════════

Create a jump-link table of contents and at-a-glance decision box:

**Table of Contents (Jump Links):**
1. Product Overview & Key Specifications
2. Who Should (and Shouldn't) Buy This
3. Unboxing & First Impressions
4. Features & Performance Deep-Dive
5. Real-World Use Cases & Testing
6. Pros & Cons Analysis
7. Comparison with Top Alternatives
8. Price Analysis & Value Assessment
9. Customer Reviews Summary
10. Maintenance & Care Guide
11. FAQ - Your Questions Answered
12. Final Verdict & Recommendation

**At-A-Glance Rating Box:**
| Criteria | Rating/Info |
|----------|-------------|
| Overall Rating | ⭐ X.X/5.0 Stars |
| Price Range | $XXX - $XXX |
| Best For | [3 specific buyer types] |
| Standout Feature | [One key differentiator] |
| Quick Verdict | [1 sentence summary] |
| Top Alternative | [If this doesn't fit] |

═══════════════════════════════════════════════════════════════════
SECTION 2: INTRODUCTION (300-400 words)
═══════════════════════════════════════════════════════════════════

**Opening Hook:** Start with a relatable problem or pain point that this product solves.

**Credibility Statement:** "We tested the [Product Name] for [X weeks/months] in real-world conditions to bring you this comprehensive, unbiased review."

**What Makes This Review Different:**
- Hands-on testing with specific metrics
- Honest pros and cons (not a sales pitch)
- Comparison with [X] alternatives we also tested
- Real customer feedback analysis

**Primary Keyword Integration:** Include "${configuration.primaryKeyword || 'product review'}" naturally in first 100 words.

**Preview Key Findings:** Tease 2-3 major discoveries without spoiling the full analysis.

═══════════════════════════════════════════════════════════════════
SECTION 3: PRODUCT OVERVIEW & KEY SPECIFICATIONS (400-500 words)
═══════════════════════════════════════════════════════════════════

**Product Positioning:** What is this product? Who makes it? What market segment does it target?

**Key Specifications Table:**
Create a detailed table with 10-15 core specs.
${hasRealData ? 'USE THE REAL PRODUCT ATTRIBUTES AND DETAILS PROVIDED ABOVE.' : ''}

**What's In The Box:**
List everything included with detailed descriptions.

**Model Variations:**
Explain different models/versions if applicable.

**Brief Manufacturer Background:**
Company reputation, product line context, notable innovations.

═══════════════════════════════════════════════════════════════════
SECTION 4: WHO SHOULD (AND SHOULDN'T) BUY THIS (350-400 words)
═══════════════════════════════════════════════════════════════════

**✅ Perfect For:**
1-5 specific user profiles with details

**❌ Not Ideal For:**
1-4 scenarios where it falls short with better alternatives

**Key Decision Factors:**
- Budget, primary use case, experience level, long-term needs

═══════════════════════════════════════════════════════════════════
SECTION 5: UNBOXING & FIRST IMPRESSIONS (350-400 words)
═══════════════════════════════════════════════════════════════════

Packaging quality, initial build assessment, setup process, out-of-box functionality.

═══════════════════════════════════════════════════════════════════
SECTION 6: FEATURES & PERFORMANCE DEEP-DIVE (2000-2500 words)
═══════════════════════════════════════════════════════════════════

${hasRealData ? 'Use the REAL features from the "About This Item" section provided above. Analyze each real feature in depth.' : 'Identify 5-7 major features.'}

For EACH feature, provide:
- What It Does (50-75 words)
- How It Works (50-75 words)
- Real-World Testing Results (150-200 words)
- Comparison to Competitors
- Strengths and Limitations
- User Feedback

═══════════════════════════════════════════════════════════════════
SECTION 7: REAL-WORLD USE CASES & TESTING (600-700 words)
═══════════════════════════════════════════════════════════════════

5-6 detailed scenarios (100-120 words each) with specific user profiles, challenges, solutions, and measurable results.

═══════════════════════════════════════════════════════════════════
SECTION 8: PROS & CONS ANALYSIS (450-500 words)
═══════════════════════════════════════════════════════════════════

6-8 detailed pros, 5-6 honest cons with explanations.

═══════════════════════════════════════════════════════════════════
SECTION 9: COMPARISON WITH TOP ALTERNATIVES (900-1000 words)
═══════════════════════════════════════════════════════════════════

Detailed comparison table and head-to-head analysis with 3 competitors.

═══════════════════════════════════════════════════════════════════
SECTION 10: PRICE ANALYSIS & VALUE ASSESSMENT (400-500 words)
═══════════════════════════════════════════════════════════════════

${hasRealData && configuration.productData?.price ? `Current price: ${configuration.productData.price}. Use this REAL price in your analysis.` : 'Research and include current pricing.'}

═══════════════════════════════════════════════════════════════════
SECTION 11: CUSTOMER REVIEWS SUMMARY (450-500 words)
═══════════════════════════════════════════════════════════════════

${hasRealData && configuration.productData?.reviews?.length ? 'Use the REAL customer reviews provided above. Quote actual customers.' : 'Analyze customer feedback patterns.'}
${hasRealData && configuration.productData?.rating ? `Real average rating: ${configuration.productData.rating}/5 from ${configuration.productData.totalReviews} reviews.` : ''}

═══════════════════════════════════════════════════════════════════
SECTION 12: MAINTENANCE & CARE GUIDE (350-400 words)
═══════════════════════════════════════════════════════════════════

Cleaning, maintenance, troubleshooting, warranty information.

═══════════════════════════════════════════════════════════════════
SECTION 13: FAQ - YOUR QUESTIONS ANSWERED (700-800 words)
═══════════════════════════════════════════════════════════════════

${hasRealData && configuration.productData?.customerQuestions?.length ? 'Include the REAL customer Q&A provided above, plus additional relevant questions.' : 'Create 20-25 comprehensive questions covering specs, performance, maintenance, and purchasing.'}

═══════════════════════════════════════════════════════════════════
SECTION 14: FINAL VERDICT & RECOMMENDATION (400-450 words)
═══════════════════════════════════════════════════════════════════

Overall rating breakdown, ideal buyers, alternatives, bottom line recommendation.

═══════════════════════════════════════════════════════════════════
CRITICAL WRITING REQUIREMENTS:
═══════════════════════════════════════════════════════════════════

1. Word Count: ${minimumRequired}+ words
2. SEO: Primary keyword in H1, first 100 words, and naturally throughout
3. Readability: 8th grade, active voice 80%+
4. Evidence & Credibility with E-E-A-T signals
5. Proper markdown formatting

Generate the complete article now following this exact structure.`;

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
        temperature: 0.7,
        max_tokens: 16000,
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
